import { authOptions } from "@/lib/auth";
import { adminDb } from "@/lib/firebase/admin";
import {
  deleteSupabaseImageByPublicUrl,
  uploadImageToSupabase,
} from "@/lib/supabase/storage";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

// POST /api/users/[userId]/avatar - Upload user profile image
export async function POST(
  request: Request,
  { params }: { params: Promise<{ userId: string }> },
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { userId } = await params;
  if (session.user.id !== userId) {
    return NextResponse.json(
      { error: "Unauthorized to update this user" },
      { status: 403 },
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const userRef = adminDb.collection("users").doc(userId);
    const userDoc = await userRef.get();
    const previousImageUrl = userDoc.exists
      ? (userDoc.data()?.image as string | undefined)
      : undefined;

    const { imageUrl } = await uploadImageToSupabase({
      file,
      kind: "avatar",
      userId,
    });

    // Update user profile with new image
    await userRef.update({
      image: imageUrl,
      updatedAt: new Date().toISOString(),
    });

    if (previousImageUrl && previousImageUrl !== imageUrl) {
      try {
        await deleteSupabaseImageByPublicUrl({
          imageUrl: previousImageUrl,
          kind: "avatar",
        });
      } catch (cleanupError) {
        console.error("Failed to delete previous avatar:", cleanupError);
      }
    }

    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error("Error uploading avatar:", error);
    const message =
      error instanceof Error ? error.message : "Failed to upload image";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
