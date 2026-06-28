import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/analytics — dashboard analytics overview
// Résilient: retourne des données vides si les tables n'existent pas encore
export async function GET() {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    thirtyDaysAgo.setHours(0, 0, 0, 0);

    let dailyStats: { date: string; visitors: number; pageViews: number; ctaClicks: number }[] = [];
    let ctaEvents: { name: string }[] = [];
    let pageViewEvents: { name: string }[] = [];
    let uniqueVisitors: { visitorId: string }[] = [];

    try {
      dailyStats = await db.dailyStat.findMany({
        where: { date: { gte: thirtyDaysAgo.toISOString().slice(0, 10) } },
        orderBy: { date: "asc" },
      });
    } catch (e) {
      console.warn("dailyStat table not ready:", e);
    }

    try {
      ctaEvents = await db.analyticsEvent.findMany({
        where: { type: "cta_click", createdAt: { gte: thirtyDaysAgo } },
        select: { name: true },
      });
    } catch (e) {
      console.warn("analyticsEvent table not ready:", e);
    }

    try {
      pageViewEvents = await db.analyticsEvent.findMany({
        where: { type: "page_view", createdAt: { gte: thirtyDaysAgo } },
        select: { name: true },
      });
    } catch (e) {
      console.warn("analyticsEvent table not ready:", e);
    }

    try {
      uniqueVisitors = await db.analyticsEvent.findMany({
        where: { type: "session_start", createdAt: { gte: thirtyDaysAgo } },
        select: { visitorId: true },
        distinct: ["visitorId"],
      });
    } catch (e) {
      console.warn("analyticsEvent table not ready:", e);
    }

    const totalVisitors = dailyStats.reduce((sum, d) => sum + d.visitors, 0);
    const totalPageViews = dailyStats.reduce((sum, d) => sum + d.pageViews, 0);
    const totalCtaClicks = dailyStats.reduce((sum, d) => sum + d.ctaClicks, 0);

    const today = new Date().toISOString().slice(0, 10);
    const todayStat = dailyStats.find((d) => d.date === today) || {
      visitors: 0,
      pageViews: 0,
      ctaClicks: 0,
    };

    const ctaBreakdown = ctaEvents.reduce<Record<string, number>>((acc, e) => {
      acc[e.name] = (acc[e.name] || 0) + 1;
      return acc;
    }, {});

    const pageViewBreakdown = pageViewEvents.reduce<Record<string, number>>(
      (acc, e) => {
        acc[e.name] = (acc[e.name] || 0) + 1;
        return acc;
      },
      {}
    );

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
    // Retourne des données vides au lieu d'une erreur 500
    return NextResponse.json({
      totals: { visitors: 0, uniqueVisitors: 0, pageViews: 0, ctaClicks: 0 },
      today: { visitors: 0, pageViews: 0, ctaClicks: 0 },
      daily: [],
      ctaBreakdown: {},
      pageViewBreakdown: {},
    });
  }
}
