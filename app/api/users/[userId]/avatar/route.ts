import { authOptions } from "@/lib/auth";
import { adminDb } from "@/lib/firebase/admin";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import sharp from "sharp";

// POST /api/users/[userId]/avatar - Upload user profile image
export async function POST(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { userId } = await params;
  if (session.user.id !== userId) {
    return NextResponse.json(
      { error: "Unauthorized to update this user" },
      { status: 403 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "File must be an image" },
        { status: 400 }
      );
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size must be less than 5MB" },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Compress and resize image
    const compressedBuffer = await sharp(buffer)
      .resize(400, 400, { // Resize to 400x400
        fit: "cover",
        position: "center",
      })
      .jpeg({ quality: 80 }) // Convert to JPEG with 80% quality
      .toBuffer();

    // Convert to base64
    const base64Image = `data:image/jpeg;base64,${compressedBuffer.toString("base64")}`;

    // Update user profile with new image
    await adminDb.collection("users").doc(userId).update({
      image: base64Image,
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({ imageUrl: base64Image });
  } catch (error) {
    console.error("Error uploading avatar:", error);
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    );
  }
} 