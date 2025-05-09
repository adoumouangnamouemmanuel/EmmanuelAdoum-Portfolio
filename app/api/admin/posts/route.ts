import { authOptions } from "@/lib/auth";
import { adminDb } from "@/lib/firebase/admin";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const postsSnapshot = await adminDb.collection("posts").get();
    const posts = await Promise.all(
      postsSnapshot.docs.map(async (doc) => {
        const post = { id: doc.id, ...doc.data() };
        // Get author info
        let author = null;
        if ((post as any).authorId) {
          const authorDoc = await adminDb.collection("users").doc((post as any).authorId).get();
          author = authorDoc.exists
            ? {
                id: authorDoc.id,
                name: authorDoc.data()?.name || "Unknown",
                image: authorDoc.data()?.image || null,
              }
            : null;
        }
        // Get comment count
        const commentsSnapshot = await adminDb.collection("comments").where("postId", "==", post.id).get();
        // Get like count
        const likesSnapshot = await adminDb.collection("likes").where("postId", "==", post.id).get();
        return {
          ...post,
          author,
          _count: {
            comments: commentsSnapshot.size,
            likes: likesSnapshot.size,
          },
        };
      })
    );
    return NextResponse.json({ posts });
  } catch (error) {
    console.error("Error fetching admin posts:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
} 