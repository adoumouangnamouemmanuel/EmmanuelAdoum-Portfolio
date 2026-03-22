import { createClient } from "@supabase/supabase-js";
import sharp from "sharp";

export type UploadKind = "avatar" | "blog";

type ProcessedImage = {
  buffer: Buffer;
  contentType: string;
  extension: "jpg" | "webp";
};

const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
]);

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function parseJwtRole(token: string): string | null {
  const segments = token.split(".");
  if (segments.length < 2) return null;

  try {
    const payload = JSON.parse(
      Buffer.from(segments[1], "base64url").toString("utf8"),
    ) as { role?: string };
    return payload.role || null;
  } catch {
    return null;
  }
}

function getSupabaseAdminClient() {
  const url = requireEnv("SUPABASE_URL");
  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;

  if (!serviceRoleKey) {
    throw new Error(
      "Missing SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_SECRET_KEY) environment variable",
    );
  }

  if (serviceRoleKey.startsWith("sb_publishable_")) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is invalid for server uploads. Use Service Role/Secret key, not publishable key.",
    );
  }

  const jwtRole = parseJwtRole(serviceRoleKey);
  if (jwtRole && jwtRole !== "service_role" && jwtRole !== "supabase_admin") {
    throw new Error(
      `SUPABASE_SERVICE_ROLE_KEY has role '${jwtRole}'. Expected 'service_role' (or 'supabase_admin').`,
    );
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

function getBucketName(kind: UploadKind): string {
  if (kind === "avatar") {
    return process.env.SUPABASE_BUCKET_PROFILE_IMAGES || "profile-images";
  }

  return process.env.SUPABASE_BUCKET_BLOG_IMAGES || "blog-images";
}

function getSupabaseProjectHost(): string {
  const url = requireEnv("SUPABASE_URL");
  return new URL(url).host;
}

export async function deleteSupabaseImageByPublicUrl({
  imageUrl,
  kind,
}: {
  imageUrl: string;
  kind: UploadKind;
}) {
  if (!imageUrl) {
    return;
  }

  let parsed: URL;
  try {
    parsed = new URL(imageUrl);
  } catch {
    return;
  }

  // Only delete objects from this project's Supabase public storage URL.
  const projectHost = getSupabaseProjectHost();
  if (parsed.host !== projectHost) {
    return;
  }

  const bucket = getBucketName(kind);
  const marker = `/storage/v1/object/public/${bucket}/`;
  const markerIndex = parsed.pathname.indexOf(marker);

  if (markerIndex === -1) {
    return;
  }

  const filePath = decodeURIComponent(
    parsed.pathname.slice(markerIndex + marker.length),
  );
  if (!filePath) {
    return;
  }

  const supabase = getSupabaseAdminClient();
  const { error } = await supabase.storage.from(bucket).remove([filePath]);

  if (error) {
    throw new Error(error.message || "Failed to delete previous image");
  }
}

export function validateImageFile(file: File, maxSizeBytes: number) {
  if (!file) {
    throw new Error("No file provided");
  }

  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    throw new Error("Only JPEG, PNG, WEBP, and AVIF images are allowed");
  }

  if (file.size > maxSizeBytes) {
    throw new Error(
      `File size must be less than ${Math.floor(maxSizeBytes / (1024 * 1024))}MB`,
    );
  }
}

function enforceFinalImageSize(
  processedBuffer: Buffer,
  maxSizeBytes: number,
  kind: UploadKind,
) {
  if (processedBuffer.length <= maxSizeBytes) {
    return;
  }

  const maxSizeMb = Math.floor(maxSizeBytes / (1024 * 1024));
  const typeLabel = kind === "avatar" ? "Avatar" : "Image";
  throw new Error(
    `${typeLabel} is too large after compression. Please choose a smaller image (<= ${maxSizeMb}MB).`,
  );
}

async function processImage(
  file: File,
  kind: UploadKind,
): Promise<ProcessedImage> {
  const bytes = await file.arrayBuffer();
  const inputBuffer = Buffer.from(bytes);

  if (kind === "avatar") {
    const buffer = await sharp(inputBuffer)
      .rotate()
      .resize(512, 512, {
        fit: "cover",
        position: "center",
      })
      .jpeg({ quality: 84, mozjpeg: true })
      .toBuffer();

    return {
      buffer,
      contentType: "image/jpeg",
      extension: "jpg",
    };
  }

  const buffer = await sharp(inputBuffer)
    .rotate()
    .resize({
      width: 1920,
      withoutEnlargement: true,
      fit: "inside",
    })
    .webp({ quality: 82 })
    .toBuffer();

  return {
    buffer,
    contentType: "image/webp",
    extension: "webp",
  };
}

export async function uploadImageToSupabase({
  file,
  kind,
  userId,
}: {
  file: File;
  kind: UploadKind;
  userId: string;
}) {
  const inputMaxSizeBytes =
    kind === "avatar" ? 20 * 1024 * 1024 : 25 * 1024 * 1024;
  const outputMaxSizeBytes =
    kind === "avatar" ? 5 * 1024 * 1024 : 10 * 1024 * 1024;

  // Allow larger originals and enforce strict limits after optimization.
  validateImageFile(file, inputMaxSizeBytes);

  const { buffer, contentType, extension } = await processImage(file, kind);
  enforceFinalImageSize(buffer, outputMaxSizeBytes, kind);

  const supabase = getSupabaseAdminClient();
  const bucket = getBucketName(kind);
  const filePath = `${userId}/${kind}/${Date.now()}-${crypto.randomUUID()}.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(filePath, buffer, {
      contentType,
      cacheControl: "31536000",
      upsert: false,
    });

  if (uploadError) {
    if (uploadError.message?.toLowerCase().includes("row-level security")) {
      throw new Error(
        "Supabase upload blocked by RLS. Verify SUPABASE_SERVICE_ROLE_KEY/SUPABASE_SECRET_KEY is a server secret key and not a publishable key.",
      );
    }

    throw new Error(uploadError.message || "Failed to upload image");
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(bucket).getPublicUrl(filePath);

  return {
    imageUrl: publicUrl,
    bucket,
    filePath,
  };
}
