import { adminDb } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";
import { type NextRequest, NextResponse } from "next/server";

// POST /api/portfolio/views - Increment portfolio view count
export async function POST(req: NextRequest) {
  try {
    // Get or create the portfolio stats document
    const statsRef = adminDb.collection('portfolio_stats').doc('views');
    const statsDoc = await statsRef.get();

    if (!statsDoc.exists) {
      // Initialize if it doesn't exist
      await statsRef.set({
        totalViews: 1,
        lastUpdated: FieldValue.serverTimestamp()
      });
    } else {
      // Increment if it exists
      await statsRef.update({
        totalViews: FieldValue.increment(1),
        lastUpdated: FieldValue.serverTimestamp()
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error incrementing portfolio view count:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// GET /api/portfolio/views - Get portfolio view count
export async function GET(req: NextRequest) {
  try {
    const statsDoc = await adminDb.collection('portfolio_stats').doc('views').get();
    
    if (!statsDoc.exists) {
      return NextResponse.json({ totalViews: 0 });
    }

    return NextResponse.json({ totalViews: statsDoc.data()?.totalViews || 0 });
  } catch (error) {
    console.error("Error fetching portfolio view count:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 