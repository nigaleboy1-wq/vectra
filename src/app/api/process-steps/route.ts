import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const steps = await db.processStep.findMany({ orderBy: { order: "asc" } });
    // Parse deliverables from JSON string
    return NextResponse.json(steps.map(s => ({
      ...s,
      deliverables: JSON.parse(s.deliverables || "[]"),
    })));
  } catch (error) {
    console.error("GET /api/process-steps error:", error);
    return NextResponse.json([]);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { no, title, duration, description, deliverables, order } = body;
    if (!title || !description) {
      return NextResponse.json({ error: "title and description are required" }, { status: 400 });
    }
    // deliverables peut être une string (séparée par virgules) ou un array
    let delivArray: string[] = [];
    if (Array.isArray(deliverables)) {
      delivArray = deliverables;
    } else if (typeof deliverables === "string" && deliverables.trim()) {
      delivArray = deliverables.split(",").map((s: string) => s.trim()).filter(Boolean);
    }
    const step = await db.processStep.create({
      data: {
        no: no || "01",
        title,
        duration: duration || "",
        description,
        deliverables: JSON.stringify(delivArray),
        order: order ?? 0,
      },
    });
    return NextResponse.json({ ...step, deliverables: JSON.parse(step.deliverables) }, { status: 201 });
  } catch (error) {
    console.error("POST /api/process-steps error:", error);
    return NextResponse.json({ error: "Failed to create step: " + String(error) }, { status: 500 });
  }
}
