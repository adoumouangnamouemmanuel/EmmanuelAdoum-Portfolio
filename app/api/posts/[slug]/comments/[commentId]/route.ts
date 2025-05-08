import { authOptions } from "@/lib/auth";
import { adminDb } from "@/lib/firebase/admin";
import { commentModel } from "@/lib/firebase/models";
import { getServerSession } from "next-auth";
import { type NextRequest, NextResponse } from "next/server";

// PATCH /api/posts/[slug]/comments/[commentId] - Update comment
export async function PATCH(
  req: NextRequest,
  { params }: { params: { slug: string; commentId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { commentId } = params;
    const { content } = await req.json();

    if (!content?.trim()) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    const comment = await commentModel.findById(commentId);
    if (!comment) {
      return NextResponse.json(
        { error: "Comment not found" },
        { status: 404 }
      );
    }

    // Check if user is the author of the comment
    if (comment.authorId !== session.user.id) {
      return NextResponse.json(
        { error: "Unauthorized to edit this comment" },
        { status: 403 }
      );
    }

    const updatedComment = await commentModel.update(commentId, {
      content: content.trim(),
      updatedAt: new Date().toISOString(),
    });

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

    return NextResponse.json({
      ...updatedComment,
      author,
    });
  } catch (error) {
    console.error("Error updating comment:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// DELETE /api/posts/[slug]/comments/[commentId] - Delete comment
export async function DELETE(
  req: NextRequest,
  { params }: { params: { slug: string; commentId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get the confirmation token from the request headers
    const confirmationToken = req.headers.get('x-confirmation-token');
    if (!confirmationToken) {
      return NextResponse.json(
        { error: "Confirmation token is required" },
        { status: 400 }
      );
    }

    // Verify the confirmation token matches the comment ID
    const { commentId } = params;
    if (confirmationToken !== commentId) {
      return NextResponse.json(
        { error: "Invalid confirmation token" },
        { status: 400 }
      );
    }

    const comment = await commentModel.findById(commentId);
    if (!comment) {
      return NextResponse.json(
        { error: "Comment not found" },
        { status: 404 }
      );
    }

    // Check if user is the author of the comment
    if (comment.authorId !== session.user.id) {
      return NextResponse.json(
        { error: "Unauthorized to delete this comment" },
        { status: 403 }
      );
    }

    await commentModel.delete(commentId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting comment:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 