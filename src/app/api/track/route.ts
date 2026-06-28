import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// POST /api/track — log an analytics event
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, name, visitorId, path, referrer } = body;

    if (!type || !name || !visitorId) {
      return NextResponse.json(
        { error: "type, name, and visitorId are required" },
        { status: 400 }
      );
    }

    // Insert the event
    await db.analyticsEvent.create({
      data: {
        type,
        name,
        visitorId,
        path: path || null,
        referrer: referrer || null,
      },
    });

    // Update daily stats
    const today = new Date().toISOString().slice(0, 10);
    const existing = await db.dailyStat.findUnique({ where: { date: today } });

    if (existing) {
      const updates: Record<string, number> = {};
      if (type === "page_view") updates.pageViews = existing.pageViews + 1;
      if (type === "cta_click") updates.ctaClicks = existing.ctaClicks + 1;
      if (type === "session_start") {
        // Check if this visitor already visited today
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const alreadyVisited = await db.analyticsEvent.findFirst({
          where: {
            visitorId,
            type: "session_start",
            createdAt: { gte: todayStart },
          },
        });
        if (!alreadyVisited) {
          updates.visitors = existing.visitors + 1;
        }
      }
      if (Object.keys(updates).length > 0) {
        await db.dailyStat.update({ where: { date: today }, data: updates });
      }
    } else {
      // Create today's stat
      let visitors = 0;
      if (type === "session_start") visitors = 1;
      await db.dailyStat.create({
        data: {
          date: today,
          visitors,
          pageViews: type === "page_view" ? 1 : 0,
          ctaClicks: type === "cta_click" ? 1 : 0,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST /api/track error:", error);
    return NextResponse.json({ error: "Failed to track event" }, { status: 500 });
  }
}
