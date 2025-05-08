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

    const usersSnapshot = await adminDb.collection("users").get();
    const users = await Promise.all(
      usersSnapshot.docs.map(async (doc) => {
        const user = { id: doc.id, ...doc.data() };
        // Get post count
        const postsSnapshot = await adminDb.collection("posts").where("authorId", "==", user.id).get();
        // Get comment count
        const commentsSnapshot = await adminDb.collection("comments").where("authorId", "==", user.id).get();
        return {
          ...user,
          _count: {
            posts: postsSnapshot.size,
            comments: commentsSnapshot.size,
          },
        };
      })
    );
    return NextResponse.json({ users });
  } catch (error) {
    console.error("Error fetching admin users:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
} 