import { authOptions } from "@/lib/auth";
import { postModel, userModel } from "@/lib/firebase/models";
import { getServerSession } from "next-auth";
import { type NextRequest, NextResponse } from "next/server";

// GET /api/posts/[slug] - Get a single post
export async function GET(
  req: NextRequest,
  context: { params: { slug: string } }
) {
  try {
    const { slug } = await context.params;

    // Find the post
    const post = await postModel.findBySlug(slug);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Get author details
    let author = null;
    if (post.authorId) {
      author = await userModel.findById(post.authorId);
    }

    // Format the response
    const response = {
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

    return NextResponse.json(response);
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
  context: { params: { slug: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is authenticated
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { slug } = await context.params;
    const { title, newSlug, excerpt, content, coverImage, categories } = await req.json();

    // Find the post by slug
    const post = await postModel.findBySlug(slug);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Check if user is the author or an admin
    if (post.authorId !== session.user.id && session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Check if new slug is unique (if changed)
    if (newSlug && newSlug !== slug) {
      const existingPost = await postModel.findBySlug(newSlug);
      if (existingPost) {
        return NextResponse.json(
          { error: "A post with this slug already exists" },
          { status: 400 }
        );
      }
    }

    // Update the post in Firestore
    const updatedPost = await postModel.update(post.id, {
      title: title || post.title,
      slug: newSlug || post.slug,
      excerpt: excerpt !== undefined ? excerpt : post.excerpt,
      content: content || post.content,
      coverImage: coverImage || post.coverImage,
      categories: categories || post.categories,
    });

    // Get author details
    let author = null;
    if (updatedPost.authorId) {
      author = await userModel.findById(updatedPost.authorId);
    }

    const responsePost = {
      ...updatedPost,
      author: author ? {
        id: author.id,
        name: author.displayName || author.name || 'Unknown',
        image: author.photoURL || author.image || '/placeholder.svg?height=40&width=40',
      } : null,
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

    // Find the post by slug
    const post = await postModel.findBySlug(slug);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Check if user is the author or an admin
    if (post.authorId !== session.user.id && session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Delete the post from Firestore
    await postModel.delete(post.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
