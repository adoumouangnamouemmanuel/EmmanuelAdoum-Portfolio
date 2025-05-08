import { authOptions } from "@/lib/auth";
import { postModel, userModel } from "@/lib/firebase/models";
import { getServerSession } from "next-auth";
import { type NextRequest, NextResponse } from "next/server";

// GET /api/posts - Get all posts
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const published = searchParams.get("published") === "true";
    const category = searchParams.get("category") || undefined;
    const limit = parseInt(searchParams.get("limit") || "10");
    const page = parseInt(searchParams.get("page") || "1");

    // Get posts from Firestore
    const { posts, total } = await postModel.findAll({
      published,
      category,
      limit,
      page,
    });

    // Get author details for each post
    const postsWithAuthors = await Promise.all(
      posts.map(async (post) => {
        let author = null;
        if (post.authorId) {
          author = await userModel.findById(post.authorId);
        }

      return {
        ...post,
          author: author ? {
            id: author.id,
            name: author.displayName || author.name || 'Unknown',
            image: author.photoURL || author.image || '/placeholder.svg?height=40&width=40',
            bio: author.bio || author.description || '',
            social: {
              github: author.github || '',
              twitter: author.twitter || '',
              linkedin: author.linkedin || '',
            }
          } : null
      };
      })
    );

    return NextResponse.json({
      posts: postsWithAuthors,
      total,
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
    const existingPost = await postModel.findBySlug(slug);
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

    // Create post in Firestore
    await postModel.create(newPost);

    // Get author details from database
    const author = await userModel.findById(session.user.id);

    return NextResponse.json(
      {
        ...newPost,
        author: {
          id: author?.id || session.user.id,
          name: author?.name || session.user.name || "Unknown",
          image: author?.image || session.user.image || null,
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
