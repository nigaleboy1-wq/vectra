import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const testimonials = await db.testimonial.findMany({ orderBy: { order: "asc" } });
    return NextResponse.json(testimonials);
  } catch (error) {
    console.error("GET /api/testimonials error:", error);
    return NextResponse.json([]);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { quote, name, role, initials, accent, order } = body;
    if (!quote || !name) {
      return NextResponse.json({ error: "quote and name are required" }, { status: 400 });
    }
    const testimonial = await db.testimonial.create({
      data: {
        quote, name, role: role || "",
        initials: initials || name.slice(0, 2).toUpperCase(),
        accent: accent || "from-[#7b39fc] to-[#a484d7]", order: order ?? 0,
      },
    });
    return NextResponse.json(testimonial, { status: 201 });
  } catch (error) {
    console.error("POST /api/testimonials error:", error);
    return NextResponse.json({ error: "Failed to create testimonial: " + String(error) }, { status: 500 });
  }
}
