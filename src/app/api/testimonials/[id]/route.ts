import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const testimonial = await db.testimonial.update({
      where: { id },
      data: {
        quote: body.quote, name: body.name, role: body.role,
        initials: body.initials, accent: body.accent, order: body.order,
      },
    });
    return NextResponse.json(testimonial);
  } catch (error) {
    console.error("PUT /api/testimonials error:", error);
    return NextResponse.json({ error: "Failed to update testimonial: " + String(error) }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await db.testimonial.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/testimonials error:", error);
    return NextResponse.json({ error: "Failed to delete testimonial: " + String(error) }, { status: 500 });
  }
}
