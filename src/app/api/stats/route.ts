import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const stats = await db.stat.findMany({ orderBy: { order: "asc" } });
    return NextResponse.json(stats);
  } catch (error) {
    console.error("GET /api/stats error:", error);
    return NextResponse.json([]);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { label, value, suffix, decimals, order } = body;
    if (!label || value === undefined) {
      return NextResponse.json({ error: "label and value are required" }, { status: 400 });
    }
    const stat = await db.stat.create({
      data: { label, value: Number(value), suffix: suffix || "", decimals: decimals || 0, order: order ?? 0 },
    });
    return NextResponse.json(stat, { status: 201 });
  } catch (error) {
    console.error("POST /api/stats error:", error);
    return NextResponse.json({ error: "Failed to create stat: " + String(error) }, { status: 500 });
  }
}
