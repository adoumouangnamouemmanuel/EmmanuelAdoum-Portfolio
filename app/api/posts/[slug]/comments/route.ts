import { authOptions } from "@/lib/auth";
import { adminDb } from "@/lib/firebase/admin";
import { postModel } from "@/lib/firebase/models";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

// GET /api/posts/[slug]/comments - Get comments for a post
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const post = await postModel.findBySlug(slug);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const commentsSnapshot = await adminDb
      .collection("comments")
      .where("postId", "==", post.id)
      .where("parentId", "==", null)
      .orderBy("createdAt", "desc")
      .get();

    const comments = await Promise.all(
      commentsSnapshot.docs.map(async (doc) => {
        const comment = { ...(doc.data() as any), id: doc.id };
        // Get replies for this comment
        const repliesSnapshot = await adminDb
          .collection("comments")
          .where("parentId", "==", doc.id)
          .orderBy("createdAt", "asc")
          .get();

        const replies = await Promise.all(
          repliesSnapshot.docs.map(async (replyDoc) => {
            const reply = { ...(replyDoc.data() as any), id: replyDoc.id };
            // Get author details for reply
            const authorDoc = await adminDb
              .collection("users")
              .doc(reply.authorId)
              .get();

            const author = authorDoc.exists
              ? {
                  id: authorDoc.id,
                  name: authorDoc.data()?.name || "Anonymous",
                  email: authorDoc.data()?.email,
                  image: authorDoc.data()?.image || null,
                }
              : {
                  id: reply.authorId,
                  name: "Anonymous",
                  email: null,
                  image: null,
                };

            return {
              ...reply,
              author,
            };
          })
        );

        // Get author details for main comment
        const authorDoc = await adminDb
          .collection("users")
          .doc(comment.authorId)
          .get();

        const author = authorDoc.exists
          ? {
              id: authorDoc.id,
              name: authorDoc.data()?.name || "Anonymous",
              email: authorDoc.data()?.email,
              image: authorDoc.data()?.image || null,
            }
          : {
              id: comment.authorId,
              name: "Anonymous",
              email: null,
              image: null,
            };

        return {
          ...comment,
          author,
          replies,
        };
      })
    );

    return NextResponse.json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}

// POST /api/posts/[slug]/comments - Create a new comment
export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { slug } = await params;
    const { content, parentId } = await request.json();

    if (!content?.trim()) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    const post = await postModel.findBySlug(slug);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // If this is a reply, verify the parent comment exists
    if (parentId) {
      const parentComment = await adminDb
        .collection("comments")
        .doc(parentId)
        .get();

      if (!parentComment.exists) {
        return NextResponse.json(
          { error: "Parent comment not found" },
          { status: 404 }
        );
      }
    }

    const commentRef = adminDb.collection("comments").doc();
    const commentData = {
      postId: post.id,
      authorId: session.user.id,
      content: content.trim(),
      parentId: parentId || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await commentRef.set(commentData);

    // Get author details
    const authorDoc = await adminDb
      .collection("users")
      .doc(session.user.id)
      .get();

    const author = authorDoc.exists
      ? {
          id: authorDoc.id,
          name: authorDoc.data()?.name || session.user.name || "Anonymous",
          email: authorDoc.data()?.email || session.user.email,
          image: authorDoc.data()?.image || session.user.image || null,
        }
      : {
          id: session.user.id,
          name: session.user.name || "Anonymous",
          email: session.user.email,
          image: session.user.image || null,
        };

    return NextResponse.json(
      {
        id: commentRef.id,
        ...commentData,
        author,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { error: "Failed to create comment" },
      { status: 500 }
    );
  }
}
