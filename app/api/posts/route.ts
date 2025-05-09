import { authOptions } from "@/lib/auth";
import { adminDb } from "@/lib/firebase/admin";
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

    // Get author details and counts for each post
    const postsWithAuthors = await Promise.all(
      posts.map(async (post) => {
        let author = null;
        if (post.authorId) {
          author = await userModel.findById(post.authorId);
        }
        // Count likes
        const likesSnapshot = await adminDb.collection("likes").where("postId", "==", post.id).get();
        // Count comments
        const commentsSnapshot = await adminDb.collection("comments").where("postId", "==", post.id).get();
        return {
          ...post,
          author: author ? {
            id: author.id,
            name: author.displayName || author.name || 'Unknown',
            image: author.photoURL || author.image || null,
            bio: author.bio || author.description || '',
            social: {
              github: author.github || '',
              twitter: author.twitter || '',
              linkedin: author.linkedin || '',
            }
          } : null,
          _count: {
            likes: likesSnapshot.size,
            comments: commentsSnapshot.size,
          }
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
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { title, slug, excerpt, content, coverImage, categories, published } = await req.json();
    if (!title || !slug || !content) {
      return NextResponse.json({ error: "Title, slug, and content are required" }, { status: 400 });
    }
    // Generate a unique slug
    let baseSlug = slug;
    let uniqueSlug = baseSlug;
    let counter = 2;
    let existing = await adminDb.collection("posts").where("slug", "==", uniqueSlug).get();
    while (!existing.empty) {
      uniqueSlug = `${baseSlug}-${counter}`;
      existing = await adminDb.collection("posts").where("slug", "==", uniqueSlug).get();
      counter++;
    }

    // Create the post
    const newPost = {
      title,
      slug: uniqueSlug,
      excerpt: excerpt || "",
      content,
      coverImage: coverImage || "/placeholder.svg?height=600&width=1200",
      published: published || false,
      views: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      authorId: session.user.id,
      categories: categories?.length ? categories : ["Uncategorized"],
      _count: { comments: 0, likes: 0 },
    };
    const docRef = await adminDb.collection("posts").add(newPost);
    // Get author details
    const authorDoc = await adminDb.collection("users").doc(session.user.id).get();
    const author = authorDoc.exists ? {
      id: authorDoc.id,
      name: authorDoc.data()?.name || session.user.name || "Unknown",
      image: authorDoc.data()?.image || session.user.image || null,
    } : {
      id: session.user.id,
      name: session.user.name || "Unknown",
      image: session.user.image || null,
    };
    return NextResponse.json({
      id: docRef.id,
        ...newPost,
      author,
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
