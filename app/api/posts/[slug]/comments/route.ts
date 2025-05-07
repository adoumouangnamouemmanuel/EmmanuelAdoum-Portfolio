import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { blogPosts } from "@/data/blog";

// Mock comments storage
const commentsStore: Record<string, any[]> = {};

// GET /api/posts/[slug]/comments - Get comments for a post
export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    // Find the post
    const post = blogPosts.find((p) => p.slug === slug);

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Get comments for the post
    const comments = commentsStore[post.id] || [];

    return NextResponse.json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// POST /api/posts/[slug]/comments - Create a comment
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
    const { content, parentId } = await req.json();

    // Validate content
    if (!content || content.trim() === "") {
      return NextResponse.json(
        { error: "Comment content is required" },
        { status: 400 }
      );
    }

    // Find the post
    const post = blogPosts.find((p) => p.slug === slug);

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // If parentId is provided, check if it exists
    if (parentId) {
      const comments = commentsStore[post.id] || [];
      const parentComment = comments.find((c) => c.id === parentId);
      if (!parentComment) {
        return NextResponse.json(
          { error: "Parent comment not found" },
          { status: 404 }
        );
      }
    }

    // Create the comment
    const newComment = {
      id: `comment-${Date.now()}`,
      content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      author: {
        id: session.user.id,
        name: session.user.name || "Anonymous",
        image: session.user.image || null,
      },
      parentId: parentId || null,
      replies: [],
    };

    // Initialize comments array for this post if it doesn't exist
    if (!commentsStore[post.id]) {
      commentsStore[post.id] = [];
    }

    // Add comment to the store
    if (parentId) {
      // Add as a reply
      const parentIndex = commentsStore[post.id].findIndex(
        (c) => c.id === parentId
      );
      if (parentIndex !== -1) {
        if (!commentsStore[post.id][parentIndex].replies) {
          commentsStore[post.id][parentIndex].replies = [];
        }
        commentsStore[post.id][parentIndex].replies.push(newComment);
      }
    } else {
      // Add as a top-level comment
      commentsStore[post.id].unshift(newComment);
    }

    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
