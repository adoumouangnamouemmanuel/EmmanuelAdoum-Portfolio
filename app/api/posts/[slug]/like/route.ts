import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { blogPosts } from "@/data/blog";

// Mock likes storage
const likes = new Map<string, Set<string>>(); // postId -> Set of userIds

// POST /api/posts/[slug]/like - Like or unlike a post
export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is authenticated
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { slug } = params;

    // Find the post
    const post = blogPosts.find((p) => p.slug === slug);

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Get or initialize the set of users who liked this post
    if (!likes.has(post.id)) {
      likes.set(post.id, new Set());
    }

    const postLikes = likes.get(post.id)!;

    // Check if the user has already liked the post
    if (postLikes.has(session.user.id)) {
      // Unlike the post
      postLikes.delete(session.user.id);
      return NextResponse.json({ liked: false });
    } else {
      // Like the post
      postLikes.add(session.user.id);
      return NextResponse.json({ liked: true });
    }
  } catch (error) {
    console.error("Error liking/unliking post:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// GET /api/posts/[slug]/like - Check if user has liked a post
export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is authenticated
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { slug } = params;

    // Find the post
    const post = blogPosts.find((p) => p.slug === slug);

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Check if the user has liked the post
    const postLikes = likes.get(post.id);
    const liked = postLikes ? postLikes.has(session.user.id) : false;

    return NextResponse.json({ liked });
  } catch (error) {
    console.error("Error checking like status:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
