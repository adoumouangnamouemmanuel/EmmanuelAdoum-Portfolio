import { authOptions } from "@/lib/auth";
import { postModel } from "@/lib/firebase/models";
import { getServerSession } from "next-auth";
import { type NextRequest, NextResponse } from "next/server";

// PATCH /api/admin/posts/[id] - Update post fields (admin only)
export async function PATCH(
  req: NextRequest,
  context: { params: { id: string } },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = context.params;
    const body = await req.json();

    const updateData: { published?: boolean } = {};
    if (typeof body?.published === "boolean") {
      updateData.published = body.published;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 },
      );
    }

    const updatedPost = await postModel.update(id, updateData);
    return NextResponse.json({ success: true, post: updatedPost });
  } catch (error) {
    console.error("Error updating post:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

// DELETE /api/admin/posts/[id] - Delete a post by ID (admin only)
export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id } = context.params;
    await postModel.delete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
