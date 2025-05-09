import { authOptions } from "@/lib/auth";
import { adminDb } from "@/lib/firebase/admin";
import { postModel } from "@/lib/firebase/models";
import { getServerSession } from "next-auth";
import { type NextRequest, NextResponse } from "next/server";

// GET /api/posts/[slug]/like - Get like status
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    const post = await postModel.findBySlug(slug);

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const likesSnapshot = await adminDb
      .collection('likes')
      .where('postId', '==', post.id)
      .get();

    return NextResponse.json({ likeCount: likesSnapshot.size });
  } catch (error) {
    console.error("Error getting like count:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// POST /api/posts/[slug]/like - Toggle like
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { slug } = await context.params;
    const post = await postModel.findBySlug(slug);

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Check if user has already liked the post
    const existingLikeSnapshot = await adminDb
      .collection('likes')
      .where('postId', '==', post.id)
      .where('userId', '==', session.user.id)
      .get();

    if (existingLikeSnapshot.empty) {
      // Add like
      const likeRef = adminDb.collection('likes').doc();
      await likeRef.set({
        postId: post.id,
        userId: session.user.id,
        createdAt: new Date().toISOString()
      });
      return NextResponse.json({ isLiked: true });
    } else {
      // Remove like
      const likeDoc = existingLikeSnapshot.docs[0];
      await likeDoc.ref.delete();
      return NextResponse.json({ isLiked: false });
    }
  } catch (error) {
    console.error("Error toggling like:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
