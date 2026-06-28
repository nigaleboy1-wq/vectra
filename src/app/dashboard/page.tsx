"use client";

import { useEffect, useState } from "react";
import { Users, Eye, MousePointerClick, TrendingUp } from "lucide-react";

type AnalyticsData = {
  totals: { visitors: number; uniqueVisitors: number; pageViews: number; ctaClicks: number };
  today: { visitors: number; pageViews: number; ctaClicks: number };
  daily: { date: string; visitors: number; pageViews: number; ctaClicks: number }[];
  ctaBreakdown: Record<string, number>;
  pageViewBreakdown: Record<string, number>;
};

const METRIC_CARDS = [
  { key: "uniqueVisitors", label: "Visiteurs uniques", icon: Users, color: "#7b39fc" },
  { key: "pageViews", label: "Pages vues", icon: Eye, color: "#a484d7" },
  { key: "ctaClicks", label: "Clics CTA", icon: MousePointerClick, color: "#c4a4ff" },
  { key: "visitors", label: "Visites totales", icon: TrendingUp, color: "#7b39fc" },
] as const;

function MiniBarChart({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data, 1);
  return (
    <div className="flex items-end gap-1 h-20">
      {data.map((v, i) => (
        <div
          key={i}
          className="flex-1 rounded-t-sm transition-all hover:opacity-80"
          style={{
            height: `${(v / max) * 100}%`,
            background: color,
            minHeight: v > 0 ? "4px" : "2px",
            opacity: v > 0 ? 0.7 + (v / max) * 0.3 : 0.15,
          }}
        />
      ))}
    </div>
  );
}

export default function DashboardOverview() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/analytics")
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-white/50 text-[14px]" style={{ fontFamily: "var(--font-inter)" }}>
          Chargement des analytics…
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-white/50 text-[14px]" style={{ fontFamily: "var(--font-inter)" }}>
        Aucune donnée disponible.
      </div>
    );
  }

  const last7Days = data.daily.slice(-7);
  const visitorsData = last7Days.map((d) => d.visitors);
  const pageViewsData = last7Days.map((d) => d.pageViews);
  const ctaClicksData = last7Days.map((d) => d.ctaClicks);

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div>
        <h1
          className="text-white text-3xl font-semibold mb-1"
          style={{ fontFamily: "var(--font-instrument-serif)" }}
        >
          Vue d'ensemble
        </h1>
        <p className="text-white/50 text-[14px]" style={{ fontFamily: "var(--font-inter)" }}>
          Analytics des 30 derniers jours
        </p>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {METRIC_CARDS.map((card) => {
          const Icon = card.icon;
          const value = data.totals[card.key as keyof typeof data.totals];
          return (
            <div
              key={card.key}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 hover:border-[rgba(164,132,215,0.4)] transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg"
                  style={{ background: `${card.color}25`, color: card.color }}
                >
                  <Icon className="h-4 w-4" strokeWidth={2} />
                </div>
              </div>
              <div
                className="text-white text-3xl font-semibold"
                style={{ fontFamily: "var(--font-instrument-serif)" }}
              >
                {value.toLocaleString("fr-FR")}
              </div>
              <div
                className="text-white/50 text-[12px] mt-1"
                style={{ fontFamily: "var(--font-cabin)" }}
              >
                {card.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Today's stats */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <h2
          className="text-white text-lg font-semibold mb-4"
          style={{ fontFamily: "var(--font-manrope)" }}
        >
          Aujourd'hui
        </h2>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <div className="text-[#c4a4ff] text-2xl font-semibold" style={{ fontFamily: "var(--font-instrument-serif)" }}>
              {data.today.visitors}
            </div>
            <div className="text-white/50 text-[12px]" style={{ fontFamily: "var(--font-cabin)" }}>
              Visiteurs
            </div>
          </div>
          <div>
            <div className="text-[#c4a4ff] text-2xl font-semibold" style={{ fontFamily: "var(--font-instrument-serif)" }}>
              {data.today.pageViews}
            </div>
            <div className="text-white/50 text-[12px]" style={{ fontFamily: "var(--font-cabin)" }}>
              Pages vues
            </div>
          </div>
          <div>
            <div className="text-[#c4a4ff] text-2xl font-semibold" style={{ fontFamily: "var(--font-instrument-serif)" }}>
              {data.today.ctaClicks}
            </div>
            <div className="text-white/50 text-[12px]" style={{ fontFamily: "var(--font-cabin)" }}>
              Clics CTA
            </div>
          </div>
        </div>
      </div>

      {/* 7-day charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h3 className="text-white/70 text-[12px] uppercase tracking-wider mb-3" style={{ fontFamily: "var(--font-cabin)" }}>
            Visiteurs (7j)
          </h3>
          <MiniBarChart data={visitorsData} color="#7b39fc" />
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h3 className="text-white/70 text-[12px] uppercase tracking-wider mb-3" style={{ fontFamily: "var(--font-cabin)" }}>
            Pages vues (7j)
          </h3>
          <MiniBarChart data={pageViewsData} color="#a484d7" />
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h3 className="text-white/70 text-[12px] uppercase tracking-wider mb-3" style={{ fontFamily: "var(--font-cabin)" }}>
            Clics CTA (7j)
          </h3>
          <MiniBarChart data={ctaClicksData} color="#c4a4ff" />
        </div>
      </div>

      {/* Breakdowns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* CTA breakdown */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h3 className="text-white text-[14px] font-semibold mb-4" style={{ fontFamily: "var(--font-manrope)" }}>
            Clics par CTA
          </h3>
          {Object.keys(data.ctaBreakdown).length === 0 ? (
            <p className="text-white/40 text-[13px]">Aucun clic enregistré</p>
          ) : (
            <div className="flex flex-col gap-3">
              {Object.entries(data.ctaBreakdown)
                .sort((a, b) => b[1] - a[1])
                .map(([name, count]) => {
                  const max = Math.max(...Object.values(data.ctaBreakdown));
                  return (
                    <div key={name} className="flex items-center gap-3">
                      <div className="w-[140px] text-white/70 text-[12px] truncate" style={{ fontFamily: "var(--font-inter)" }}>
                        {name}
                      </div>
                      <div className="flex-1 h-6 rounded bg-white/5 overflow-hidden">
                        <div
                          className="h-full rounded bg-[#7b39fc] transition-all"
                          style={{ width: `${(count / max) * 100}%` }}
                        />
                      </div>
                      <div className="text-white text-[13px] font-semibold w-8 text-right">{count}</div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>

        {/* Page views breakdown */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h3 className="text-white text-[14px] font-semibold mb-4" style={{ fontFamily: "var(--font-manrope)" }}>
            Vues par section
          </h3>
          {Object.keys(data.pageViewBreakdown).length === 0 ? (
            <p className="text-white/40 text-[13px]">Aucune vue enregistrée</p>
          ) : (
            <div className="flex flex-col gap-3">
              {Object.entries(data.pageViewBreakdown)
                .sort((a, b) => b[1] - a[1])
                .map(([name, count]) => {
                  const max = Math.max(...Object.values(data.pageViewBreakdown));
                  return (
                    <div key={name} className="flex items-center gap-3">
                      <div className="w-[140px] text-white/70 text-[12px] truncate" style={{ fontFamily: "var(--font-inter)" }}>
                        {name}
                      </div>
                      <div className="flex-1 h-6 rounded bg-white/5 overflow-hidden">
                        <div
                          className="h-full rounded bg-[#a484d7] transition-all"
                          style={{ width: `${(count / max) * 100}%` }}
                        />
                      </div>
                      <div className="text-white text-[13px] font-semibold w-8 text-right">{count}</div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
