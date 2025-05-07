import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { posts, users, comments } from "@/lib/firebase/fallback-data";

// GET /api/posts - Get all posts
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const published = searchParams.get("published");
    const category = searchParams.get("category");
    const limitParam = searchParams.get("limit");
    const pageParam = searchParams.get("page");

    const limit = limitParam ? Number.parseInt(limitParam) : 10;
    const page = pageParam ? Number.parseInt(pageParam) : 1;

    // Filter posts based on query parameters
    let filteredPosts = [...posts];

    if (published !== null) {
      filteredPosts = filteredPosts.filter(
        (post) => post.published === (published === "true")
      );
    }

    if (category) {
      filteredPosts = filteredPosts.filter(
        (post) => post.categories && post.categories.includes(category)
      );
    }

    // Sort by createdAt (newest first)
    filteredPosts.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // Paginate
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

    // Add author and count information
    const postsWithDetails = paginatedPosts.map((post) => {
      const author = users.find((u) => u.id === post.authorId);
      const postComments = comments.filter((c) => c.postId === post.id);
      const likesCount = Math.floor(Math.random() * 10); // Mock likes count

      return {
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
    });

    return NextResponse.json({
      posts: postsWithDetails,
      pagination: {
        total: filteredPosts.length,
        pages: Math.ceil(filteredPosts.length / limit),
        page,
        limit,
      },
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// POST /api/posts - Create a new post
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is authenticated
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, slug, excerpt, content, coverImage, categories, published } =
      await req.json();

    // Validate required fields
    if (!title || !slug || !content) {
      return NextResponse.json(
        { error: "Title, slug, and content are required" },
        { status: 400 }
      );
    }

    // Check if slug is unique
    const existingPost = posts.find((p) => p.slug === slug);
    if (existingPost) {
      return NextResponse.json(
        { error: "A post with this slug already exists" },
        { status: 400 }
      );
    }

    // Create the post
    const newPost = {
      id: `post-${Date.now()}`,
      title,
      slug,
      excerpt: excerpt || "",
      content,
      coverImage: coverImage || "/placeholder.svg?height=600&width=1200",
      published: published || false,
      views: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      authorId: session.user.id,
      categories: categories?.length ? categories : ["Uncategorized"],
      _count: {
        comments: 0,
        likes: 0,
      },
    };

    // Add to our mock array
    posts.push(newPost);

    // Get author details
    const author = users.find((u) => u.id === session.user.id) || {
      id: session.user.id,
      name: session.user.name || "Unknown",
      image: session.user.image || null,
    };

    return NextResponse.json(
      {
        ...newPost,
        author: {
          id: author.id,
          name: author.name,
          image: author.image,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
