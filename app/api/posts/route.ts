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
import { enforceRateLimit } from "@/lib/security/rate-limit";
import { getServerSession } from "next-auth";
import { type NextRequest, NextResponse } from "next/server";

// GET /api/posts - Get all posts
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const publishedParam = searchParams.get("published");
    const published =
      publishedParam === null ? true : publishedParam === "true";
    const wantsUnpublished = publishedParam === "false";
    const category = searchParams.get("category") || undefined;
    const limit = parseInt(searchParams.get("limit") || "10");
    const page = parseInt(searchParams.get("page") || "1");

    if (wantsUnpublished) {
      const session = await getServerSession(authOptions);
      if (!session?.user || !isPrivilegedRole(session.user.role)) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }

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
        const likesSnapshot = await adminDb
          .collection("likes")
          .where("postId", "==", post.id)
          .get();
        // Count comments
        const commentsSnapshot = await adminDb
          .collection("comments")
          .where("postId", "==", post.id)
          .get();
        return {
          ...post,
          title: sanitizePlainText(post.title || "", 180),
          excerpt: sanitizePlainText(post.excerpt || "", 500),
          content: sanitizeBlogHtml(post.content || ""),
          author: author
            ? {
                id: author.id,
                name: author.displayName || author.name || "Unknown",
                image: author.photoURL || author.image || null,
                bio: author.bio || author.description || "",
                social: {
                  github: author.github || "",
                  twitter: author.twitter || "",
                  linkedin: author.linkedin || "",
                },
              }
            : null,
          _count: {
            likes: likesSnapshot.size,
            comments: commentsSnapshot.size,
          },
        };
      }),
    );

    return NextResponse.json({
      posts: postsWithAuthors,
      total,
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

// POST /api/posts - Create a new post
export async function POST(req: NextRequest) {
  const limited = enforceRateLimit(req, {
    key: "posts-create",
    windowMs: 10 * 60 * 1000,
    maxRequests: 10,
    message: "Too many post creation attempts. Please wait and try again.",
  });
  if (limited) return limited;

  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const canPublish = isPrivilegedRole(session.user.role);
    const { title, slug, excerpt, content, coverImage, categories, published } =
      await req.json();
    if (!title || !slug || !content) {
      return NextResponse.json(
        { error: "Title, slug, and content are required" },
        { status: 400 },
      );
    }

    const safeTitle = sanitizePlainText(title, 180);
    const safeSlug = sanitizeSlug(slug || title);
    const safeExcerpt = sanitizePlainText(excerpt || "", 500);
    const safeContent = sanitizeBlogHtml(content);
    const safeCoverImage = normalizeCoverImage(coverImage);
    const safeCategories = sanitizeCategories(categories);

    if (!safeTitle || !safeSlug || !safeContent) {
      return NextResponse.json(
        { error: "Invalid post content" },
        { status: 400 },
      );
    }

    // Generate a unique slug
    let baseSlug = safeSlug;
    let uniqueSlug = baseSlug;
    let counter = 2;
    let existing = await adminDb
      .collection("posts")
      .where("slug", "==", uniqueSlug)
      .get();
    while (!existing.empty) {
      uniqueSlug = `${baseSlug}-${counter}`;
      existing = await adminDb
        .collection("posts")
        .where("slug", "==", uniqueSlug)
        .get();
      counter++;
    }

    // Create the post
    const newPost = {
      title: safeTitle,
      slug: uniqueSlug,
      excerpt: safeExcerpt,
      content: safeContent,
      coverImage: safeCoverImage,
      published: canPublish ? Boolean(published) : false,
      views: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      authorId: session.user.id,
      categories: safeCategories,
      _count: { comments: 0, likes: 0 },
    };
    const docRef = await adminDb.collection("posts").add(newPost);
    // Get author details
    const authorDoc = await adminDb
      .collection("users")
      .doc(session.user.id)
      .get();
    const author = authorDoc.exists
      ? {
          id: authorDoc.id,
          name: authorDoc.data()?.name || session.user.name || "Unknown",
          image: authorDoc.data()?.image || session.user.image || null,
        }
      : {
          id: session.user.id,
          name: session.user.name || "Unknown",
          image: session.user.image || null,
        };
    return NextResponse.json(
      {
        id: docRef.id,
        ...newPost,
        author,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
