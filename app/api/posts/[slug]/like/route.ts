import { postModel } from "@/lib/firebase/models";
import { type NextRequest, NextResponse } from "next/server";

// GET /api/posts/[slug]/like - Get like status
export async function GET(
  req: NextRequest,
  context: { params: { slug: string } }
) {
  try {
    const { slug } = context.params;
    const post = await postModel.findBySlug(slug);
    
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const likeCount = await postModel.getLikeCount(post.id);
    return NextResponse.json({ likeCount });
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
  context: { params: { slug: string } }
) {
  try {
    const { slug } = context.params;
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const post = await postModel.findBySlug(slug);
    
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const isLiked = await postModel.toggleLike(post.id, userId);
    return NextResponse.json({ isLiked });
  } catch (error) {
    console.error("Error toggling like:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
