import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    // deliverables peut être une string (séparée par virgules) ou un array
    let delivArray: string[] = [];
    if (Array.isArray(body.deliverables)) {
      delivArray = body.deliverables;
    } else if (typeof body.deliverables === "string" && body.deliverables.trim()) {
      delivArray = body.deliverables.split(",").map((s: string) => s.trim()).filter(Boolean);
    }
    const step = await db.processStep.update({
      where: { id },
      data: {
        no: body.no,
        title: body.title,
        duration: body.duration,
        description: body.description,
        deliverables: JSON.stringify(delivArray),
        order: body.order,
      },
    });
    return NextResponse.json({ ...step, deliverables: JSON.parse(step.deliverables) });
  } catch (error) {
    console.error("PUT /api/process-steps error:", error);
    return NextResponse.json({ error: "Failed to update step: " + String(error) }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await db.processStep.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/process-steps error:", error);
    return NextResponse.json({ error: "Failed to delete step: " + String(error) }, { status: 500 });
  }
}
