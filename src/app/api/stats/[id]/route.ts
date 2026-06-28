import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const stat = await db.stat.update({
      where: { id },
      data: {
        label: body.label, value: Number(body.value),
        suffix: body.suffix, decimals: body.decimals || 0, order: body.order,
      },
    });
    return NextResponse.json(stat);
  } catch (error) {
    console.error("PUT /api/stats error:", error);
    return NextResponse.json({ error: "Failed to update stat" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await db.stat.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/stats error:", error);
    return NextResponse.json({ error: "Failed to delete stat" }, { status: 500 });
  }
}
