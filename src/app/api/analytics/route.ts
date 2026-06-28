import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/analytics — dashboard analytics overview
export async function GET() {
  try {
    // Last 30 days daily stats
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    thirtyDaysAgo.setHours(0, 0, 0, 0);

    const dailyStats = await db.dailyStat.findMany({
      where: { date: { gte: thirtyDaysAgo.toISOString().slice(0, 10) } },
      orderBy: { date: "asc" },
    });

    // Totals
    const totalVisitors = dailyStats.reduce((sum, d) => sum + d.visitors, 0);
    const totalPageViews = dailyStats.reduce((sum, d) => sum + d.pageViews, 0);
    const totalCtaClicks = dailyStats.reduce((sum, d) => sum + d.ctaClicks, 0);

    // Today
    const today = new Date().toISOString().slice(0, 10);
    const todayStat = dailyStats.find((d) => d.date === today) || {
      visitors: 0,
      pageViews: 0,
      ctaClicks: 0,
    };

    // CTA clicks breakdown (last 30 days)
    const ctaEvents = await db.analyticsEvent.findMany({
      where: {
        type: "cta_click",
        createdAt: { gte: thirtyDaysAgo },
      },
      select: { name: true },
    });

    const ctaBreakdown = ctaEvents.reduce<Record<string, number>>((acc, e) => {
      acc[e.name] = (acc[e.name] || 0) + 1;
      return acc;
    }, {});

    // Page views breakdown (last 30 days)
    const pageViewEvents = await db.analyticsEvent.findMany({
      where: {
        type: "page_view",
        createdAt: { gte: thirtyDaysAgo },
      },
      select: { name: true },
    });

    const pageViewBreakdown = pageViewEvents.reduce<Record<string, number>>(
      (acc, e) => {
        acc[e.name] = (acc[e.name] || 0) + 1;
        return acc;
      },
      {}
    );

    // Unique visitors count (last 30 days)
    const uniqueVisitors = await db.analyticsEvent.findMany({
      where: {
        type: "session_start",
        createdAt: { gte: thirtyDaysAgo },
      },
      select: { visitorId: true },
      distinct: ["visitorId"],
    });

    return NextResponse.json({
      totals: {
        visitors: totalVisitors,
        uniqueVisitors: uniqueVisitors.length,
        pageViews: totalPageViews,
        ctaClicks: totalCtaClicks,
      },
      today: todayStat,
      daily: dailyStats.map((d) => ({
        date: d.date,
        visitors: d.visitors,
        pageViews: d.pageViews,
        ctaClicks: d.ctaClicks,
      })),
      ctaBreakdown,
      pageViewBreakdown,
    });
  } catch (error) {
    console.error("GET /api/analytics error:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
