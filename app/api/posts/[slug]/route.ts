import { authOptions } from "@/lib/auth";
import { adminDb } from "@/lib/firebase/admin";
import { postModel, userModel } from "@/lib/firebase/models";
import {
  isPrivilegedRole,
  normalizeCoverImage,
  sanitizeBlogHtml,
  sanitizeCategories,
  sanitizePlainText,
  sanitizeSlug,
} from "@/lib/security/content";
import { getServerSession } from "next-auth";
import { type NextRequest, NextResponse } from "next/server";

// GET /api/posts/[slug] - Get a single post
export async function GET(
  req: NextRequest,
  context: { params: { slug: string } },
) {
  try {
    const session = await getServerSession(authOptions);
    const { slug } = await context.params;

    // Find the post
    const post = await postModel.findBySlug(slug);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const isOwner = session?.user?.id === post.authorId;
    const isPrivilegedUser = isPrivilegedRole(session?.user?.role);

    if (!post.published && !isOwner && !isPrivilegedUser) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Get author details
    let author = null;
    if (post.authorId) {
      author = await userModel.findById(post.authorId);
    }

    // Use snapshot size for compatibility with Firestore Admin versions
    // that don't support the aggregation `count()` API.
    const [commentsSnapshot, likesSnapshot] = await Promise.all([
      adminDb.collection("comments").where("postId", "==", post.id).get(),
      adminDb.collection("likes").where("postId", "==", post.id).get(),
    ]);
    const commentsCount = commentsSnapshot.size;
    const likesCount = likesSnapshot.size;

    // Format the response
    const response = {
      ...post,
      title: sanitizePlainText(post.title || "", 180),
      excerpt: sanitizePlainText(post.excerpt || "", 500),
      content: sanitizeBlogHtml(post.content || ""),
      _count: {
        comments: commentsCount,
        likes: likesCount,
      },
      author: author
        ? {
            id: author.id,
            name: author.displayName || author.name || "Unknown",
            image:
              author.photoURL ||
              author.image ||
              "/placeholder.svg?height=40&width=40",
            bio: author.bio || author.description || "",
            social: {
              github: author.github || "",
              twitter: author.twitter || "",
              linkedin: author.linkedin || "",
            },
          }
        : null,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

// PUT /api/posts/[slug] - Update a post
export async function PUT(
  req: NextRequest,
  context: { params: { slug: string } },
) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is authenticated
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { slug } = await context.params;
    const { title, newSlug, excerpt, content, coverImage, categories } =
      await req.json();

    // Find the post by slug
    const post = await postModel.findBySlug(slug);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Check if user is the author or an admin
    if (post.authorId !== session.user.id && session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const safeTitle =
      title !== undefined ? sanitizePlainText(title, 180) : undefined;
    const safeSlug = newSlug !== undefined ? sanitizeSlug(newSlug) : undefined;
    const safeExcerpt =
      excerpt !== undefined ? sanitizePlainText(excerpt, 500) : undefined;
    const safeContent =
      content !== undefined ? sanitizeBlogHtml(content) : undefined;
    const safeCoverImage =
      coverImage !== undefined ? normalizeCoverImage(coverImage) : undefined;
    const safeCategories =
      categories !== undefined ? sanitizeCategories(categories) : undefined;

    // Check if new slug is unique (if changed)
    if (safeSlug && safeSlug !== slug) {
      const existingPost = await postModel.findBySlug(safeSlug);
      if (existingPost) {
        return NextResponse.json(
          { error: "A post with this slug already exists" },
          { status: 400 },
        );
      }
    }

    // Update the post in Firestore
    const updatedPost = await postModel.update(post.id, {
      title: safeTitle || post.title,
      slug: safeSlug || post.slug,
      excerpt: safeExcerpt !== undefined ? safeExcerpt : post.excerpt,
      content: safeContent !== undefined ? safeContent : post.content,
      coverImage:
        safeCoverImage !== undefined ? safeCoverImage : post.coverImage,
      categories:
        safeCategories !== undefined ? safeCategories : post.categories,
    });

    // Get author details
    let author = null;
    if (updatedPost.authorId) {
      author = await userModel.findById(updatedPost.authorId);
    }

    const responsePost = {
      ...updatedPost,
      title: sanitizePlainText(updatedPost.title || "", 180),
      excerpt: sanitizePlainText(updatedPost.excerpt || "", 500),
      content: sanitizeBlogHtml(updatedPost.content || ""),
      author: author
        ? {
            id: author.id,
            name: author.displayName || author.name || "Unknown",
            image:
              author.photoURL ||
              author.image ||
              "/placeholder.svg?height=40&width=40",
          }
        : null,
    };

    return NextResponse.json(responsePost);
  } catch (error) {
    console.error("Error updating post:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

// DELETE /api/posts/[slug] - Delete a post
export async function DELETE(
  req: NextRequest,
  { params }: { params: { slug: string } },
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
      { status: 500 },
    );
  }
}
