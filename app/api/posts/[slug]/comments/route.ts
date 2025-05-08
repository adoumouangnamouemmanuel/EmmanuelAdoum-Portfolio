import { authOptions } from "@/lib/auth";
import { adminDb } from "@/lib/firebase/admin";
import { postModel } from "@/lib/firebase/models";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

// GET /api/posts/[slug]/comments - Get comments for a post
export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const post = await postModel.findBySlug(params.slug);
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
        const comment = { id: doc.id, ...doc.data() };
        // Get replies for this comment
        const repliesSnapshot = await adminDb
          .collection("comments")
          .where("parentId", "==", doc.id)
          .orderBy("createdAt", "asc")
          .get();

        const replies = await Promise.all(
          repliesSnapshot.docs.map(async (replyDoc) => {
            const reply = { id: replyDoc.id, ...replyDoc.data() };
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

// POST /api/posts/[slug]/comments - Create a comment
export async function POST(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { content, parentId } = await request.json();

    if (!content) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    const post = await postModel.findBySlug(params.slug);
    if (!post) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      );
    }

    // If parentId is provided, verify the parent comment exists
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
    const now = new Date().toISOString();

    const commentData = {
      content,
      authorId: session.user.id,
      postId: post.id,
      parentId: parentId || null,
      createdAt: now,
      updatedAt: now,
    };

    try {
      await commentRef.set(commentData);
      console.log("Comment created successfully:", commentRef.id);
    } catch (error) {
      console.error("Error creating comment in Firestore:", error);
      return NextResponse.json(
        { error: "Failed to create comment in database" },
        { status: 500 }
      );
    }

    // Get the author details
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
