import { authOptions } from "@/lib/auth";
import {
  deleteSupabaseImageByPublicUrl,
  uploadImageToSupabase,
  type UploadKind,
} from "@/lib/supabase/storage";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

function parseUploadKind(value: FormDataEntryValue | null): UploadKind {
  if (value === "avatar" || value === "blog") {
    return value;
  }
  return "blog";
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const kind = parseUploadKind(formData.get("kind"));
    const previousImageUrl = formData.get("previousImageUrl");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const { imageUrl } = await uploadImageToSupabase({
      file,
      kind,
      userId: session.user.id,
    });

    if (typeof previousImageUrl === "string" && previousImageUrl !== imageUrl) {
      try {
        await deleteSupabaseImageByPublicUrl({
          imageUrl: previousImageUrl,
          kind,
        });
      } catch (cleanupError) {
        console.error("Failed to clean up previous image:", cleanupError);
      }
    }

    return NextResponse.json({ imageUrl });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to upload image";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
