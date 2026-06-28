import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const projects = await db.project.findMany({ orderBy: { order: "asc" } });
    return NextResponse.json(projects);
  } catch (error) {
    console.error("GET /api/projects error:", error);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, category, description, domain, year, mockupFrom, mockupTo, accent, order } = body;
    if (!title || !description) {
      return NextResponse.json({ error: "title and description are required" }, { status: 400 });
    }
    const project = await db.project.create({
      data: {
        title, category: category || "", description, domain: domain || "",
        year: year || new Date().getFullYear().toString(),
        mockupFrom: mockupFrom || "#7b39fc", mockupTo: mockupTo || "#2b2344",
        accent: accent || "#c4a4ff", order: order ?? 0,
      },
    });
    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("POST /api/projects error:", error);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
