import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const services = await db.service.findMany({ orderBy: { order: "asc" } });
    return NextResponse.json(services);
  } catch (error) {
    console.error("GET /api/services error:", error);
    return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, description, iconName, order } = body;
    if (!title || !description) {
      return NextResponse.json({ error: "title and description are required" }, { status: 400 });
    }
    const service = await db.service.create({
      data: { title, description, iconName: iconName || "Code2", order: order ?? 0 },
    });
    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    console.error("POST /api/services error:", error);
    return NextResponse.json({ error: "Failed to create service" }, { status: 500 });
  }
}
