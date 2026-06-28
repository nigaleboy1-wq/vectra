import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const project = await db.project.update({
      where: { id },
      data: {
        title: body.title, category: body.category, description: body.description,
        domain: body.domain, year: body.year, mockupFrom: body.mockupFrom,
        mockupTo: body.mockupTo, accent: body.accent, order: body.order,
      },
    });
    return NextResponse.json(project);
  } catch (error) {
    console.error("PUT /api/projects error:", error);
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await db.project.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/projects error:", error);
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
