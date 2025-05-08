import { authOptions } from "@/lib/auth";
import { adminDb } from "@/lib/firebase/admin";
import { getServerSession } from "next-auth";
import { type NextRequest, NextResponse } from "next/server";

// GET /api/users/[userId]/notifications - Get user notification preferences
export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { userId } = params;
    const userDoc = await adminDb.collection("users").doc(userId).get();

    if (!userDoc.exists) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const userData = userDoc.data();
    return NextResponse.json({
      emailNotifications: userData?.emailNotifications ?? true,
      commentNotifications: userData?.commentNotifications ?? true,
    });
  } catch (error) {
    console.error("Error fetching notification preferences:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// PATCH /api/users/[userId]/notifications - Update user notification preferences
export async function PATCH(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { userId } = params;
    if (session.user.id !== userId) {
      return NextResponse.json(
        { error: "Unauthorized to update this user" },
        { status: 403 }
      );
    }

    const updates = await req.json();
    const userRef = adminDb.collection("users").doc(userId);

    // Update only notification preferences
    await userRef.update({
      emailNotifications: updates.emailNotifications,
      commentNotifications: updates.commentNotifications,
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating notification preferences:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 