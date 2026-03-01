import React from "react";

type DashboardMetric = {
  label: string;
  value: string;
  trend: string;
};

const metrics: DashboardMetric[] = [
  { label: "Protocol TVL", value: "$12.4M", trend: "+8.3% / 24h" },
  { label: "Oracle Confidence", value: "98.2%", trend: "Stable" },
  { label: "Staked Validators", value: "144", trend: "+3 today" },
  { label: "Risk Exposure", value: "Low", trend: "Tier 1" }
];

const activityFeed = [
  "Oracle score update executed for Treasury Vault #2",
  "USDC flow simulation completed on Fuji",
  "Capital lock transaction confirmed",
  "Governance multisig approved ORACLE_ROLE rotation"
];

export const BTCIDashboardOverview: React.FC = () => {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-8 text-white">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="btci-glass-panel flex flex-wrap items-center justify-between gap-4 px-6 py-4">
          <div>
            <p className="btci-section-title">BTCI Dashboard</p>
            <h1 className="text-xl font-semibold">Overview</h1>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-sm">
            <select className="rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-slate-100 outline-none">
              <option>Avalanche Fuji</option>
              <option>Avalanche Mainnet</option>
            </select>

            <span className="rounded-xl border border-white/20 bg-white/10 px-3 py-2 font-mono text-xs">
              0x8A1f...2E9c
            </span>

            <span className="rounded-full border border-emerald-300/40 bg-emerald-400/20 px-3 py-1 text-xs font-semibold text-emerald-100">
              Engine v1.0
            </span>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-6">
            <article className="btci-glass-panel px-6 py-8">
              <p className="btci-section-title">Capital Coherence Index</p>
              <div className="mt-3 flex items-end gap-3">
                <span className="text-6xl font-bold leading-none">842</span>
                <span className="pb-2 text-lg text-slate-300">/ 1000</span>
              </div>
              <p className="mt-4 btci-muted-copy">Tier 1 — Structural Integrity</p>
            </article>

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {metrics.map((metric) => (
                <article key={metric.label} className="btci-glass-panel px-4 py-4">
                  <p className="btci-section-title">{metric.label}</p>
                  <p className="mt-2 btci-value-label">{metric.value}</p>
                  <p className="mt-1 text-xs text-slate-300">{metric.trend}</p>
                </article>
              ))}
            </section>

            <article className="btci-glass-panel px-6 py-6">
              <p className="btci-section-title">Treasury Balance</p>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-semibold">4,218.66</span>
                <span className="text-slate-300">AVAX</span>
              </div>
              <p className="mt-3 btci-muted-copy">Backed by protocol reserves and active capital locks.</p>
            </article>
          </div>

          <aside className="btci-glass-panel px-5 py-5">
            <p className="btci-section-title">Activity Feed</p>
            <ul className="mt-4 space-y-3">
              {activityFeed.map((item, index) => (
                <li key={item} className="rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-sm text-slate-100">
                  <p className="font-medium">{item}</p>
                  <p className="mt-1 text-xs text-slate-400">Event #{index + 1}</p>
                </li>
              ))}
            </ul>
          </aside>
        </section>
      </div>
    </main>
  );
};

export default BTCIDashboardOverview;
