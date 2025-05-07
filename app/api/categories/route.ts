import { NextResponse } from "next/server";
import { categories } from "@/lib/firebase/fallback-data";

export async function GET() {
  try {
    return NextResponse.json({ categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
