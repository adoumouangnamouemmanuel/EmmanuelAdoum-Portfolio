import { authOptions } from "@/lib/auth";
import { adminDb } from "@/lib/firebase/admin";
import { getServerSession } from "next-auth";
import { type NextRequest, NextResponse } from "next/server";

// POST /api/users/[userId]/avatar - Upload user profile image
export async function POST(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { userId } = params;
    if (session.user.id !== userId) {
      return NextResponse.json(
        { error: "Unauthorized to update this user" },
        { status: 403 }
      );
    }

    const formData = await req.formData();
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

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size must be less than 5MB" },
        { status: 400 }
      );
    }

    // Convert file to base64
    const buffer = await file.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");
    const imageUrl = `data:${file.type};base64,${base64}`;

    // Update user profile with new image
    const userRef = adminDb.collection("users").doc(userId);
    await userRef.update({
      image: imageUrl,
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({ 
      success: true,
      imageUrl 
    });
  } catch (error) {
    console.error("Error uploading avatar:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 