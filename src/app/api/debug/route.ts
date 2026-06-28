import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// Endpoint de debug temporaire — À SUPPRIMER en production
export async function GET() {
  const debug: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    databaseUrl: process.env.DATABASE_URL
      ? `${process.env.DATABASE_URL.substring(0, 30)}...`
      : "NOT SET",
    nodeEnv: process.env.NODE_ENV,
  };

  // Test de connexion Prisma
  try {
    const count = await db.service.count();
    debug.servicesCount = count;
    debug.dbStatus = "connected";
  } catch (error) {
    debug.dbStatus = "error";
    debug.dbError = error instanceof Error ? error.message : String(error);
    debug.dbErrorCode = (error as { code?: string }).code;
  }

  return NextResponse.json(debug, { status: 200 });
}
