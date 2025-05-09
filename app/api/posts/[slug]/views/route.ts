import { adminDb } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";
import { type NextRequest, NextResponse } from "next/server";

// POST /api/posts/[slug]/views - Increment view count
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    // Use Admin SDK to find the post by slug
    const postsSnapshot = await adminDb.collection('posts').where('slug', '==', slug).limit(1).get();
    if (postsSnapshot.empty) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    const postRef = postsSnapshot.docs[0].ref;
    // Increment views
    await postRef.update({
      views: FieldValue.increment(1)
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error incrementing view count:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 