import { postModel } from "@/lib/firebase/models";
import { type NextRequest, NextResponse } from "next/server";

// POST /api/posts/[slug]/views - Increment view count
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    const post = await postModel.findBySlug(slug);
    
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Get the view count from the request headers
    const viewCount = req.headers.get("x-view-count");
    const lastViewed = req.headers.get("x-last-viewed");

    // If the view count is 0 or not provided, increment the count
    if (!viewCount || viewCount === "0") {
      await postModel.incrementViews(post.id);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error incrementing view count:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 