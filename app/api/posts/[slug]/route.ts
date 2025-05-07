import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { posts, users, comments } from "@/lib/firebase/fallback-data";

// GET /api/posts/[slug] - Get a post by slug
export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    // For local testing, use fallback data
    const post = posts.find((p) => p.slug === slug);

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Add author information
    const author = users.find((u) => u.id === post.authorId);

    // Count comments and likes
    const postComments = comments.filter((c) => c.postId === post.id);
    const likesCount = Math.floor(Math.random() * 10); // Mock likes count

    const postWithDetails = {
      ...post,
      author: {
        id: author?.id || "",
        name: author?.name || "Unknown",
        image: author?.image || null,
      },
      _count: {
        comments: postComments.length,
        likes: likesCount,
      },
    };

    return NextResponse.json(postWithDetails);
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// PUT /api/posts/[slug] - Update a post
export async function PUT(
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
    const { title, newSlug, excerpt, content, coverImage, categories } =
      await req.json();

    // Find the post in our mock data
    const postIndex = posts.findIndex((p) => p.slug === slug);

    if (postIndex === -1) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const post = posts[postIndex];

    // Check if user is the author or an admin
    if (post.authorId !== session.user.id && session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Check if new slug is unique (if changed)
    if (newSlug && newSlug !== slug) {
      const existingPost = posts.find((p) => p.slug === newSlug);
      if (existingPost) {
        return NextResponse.json(
          { error: "A post with this slug already exists" },
          { status: 400 }
        );
      }
    }

    // Update the post
    const updatedPost = {
      ...post,
      title: title || post.title,
      slug: newSlug || post.slug,
      excerpt: excerpt !== undefined ? excerpt : post.excerpt,
      content: content || post.content,
      coverImage: coverImage || post.coverImage,
      categories: categories || post.categories,
      updatedAt: new Date().toISOString(),
    };

    // Replace the post in our mock array
    posts[postIndex] = updatedPost;

    // Add author information
    const author = users.find((u) => u.id === updatedPost.authorId);

    const responsePost = {
      ...updatedPost,
      author: {
        id: author?.id || "",
        name: author?.name || "Unknown",
        image: author?.image || null,
      },
    };

    return NextResponse.json(responsePost);
  } catch (error) {
    console.error("Error updating post:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// DELETE /api/posts/[slug] - Delete a post
export async function DELETE(
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
    const postIndex = posts.findIndex((p) => p.slug === slug);

    if (postIndex === -1) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const post = posts[postIndex];

    // Check if user is the author or an admin
    if (post.authorId !== session.user.id && session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Delete the post from our mock array
    posts.splice(postIndex, 1);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
