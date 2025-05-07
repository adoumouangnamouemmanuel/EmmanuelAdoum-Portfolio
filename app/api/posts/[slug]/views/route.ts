import { postModel } from "@/lib/firebase/models";
import { type NextRequest, NextResponse } from "next/server";

// POST /api/posts/[slug]/views - Increment post views
export async function POST(
  req: NextRequest,
  context: { params: { slug: string } }
) {
  try {
    const { slug } = context.params;

    // Find the post by slug
    const post = await postModel.findBySlug(slug);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Increment views
    await postModel.incrementViews(post.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error incrementing views:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 