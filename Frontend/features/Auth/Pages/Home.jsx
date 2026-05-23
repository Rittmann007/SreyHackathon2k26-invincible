import React from 'react';
import Navbar from './Navbar';

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Navbar />

      <main>
        <section className="relative overflow-hidden bg-[linear-gradient(135deg,#74b9ff_0%,#a29bfe_50%,#74b9ff_100%)] px-4 py-24 text-center sm:px-6 lg:px-8 lg:py-28">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),transparent_30%),radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_26%),linear-gradient(120deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02)_40%,rgba(255,255,255,0.12))]" />

          <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center">
            <h1 className="text-5xl font-black tracking-[-0.06em] text-slate-950 sm:text-6xl lg:text-7xl">
              TaskHive
            </h1>
            <p className="mt-5 max-w-3xl text-base font-semibold leading-8 text-slate-700 sm:text-lg lg:text-xl">
              Connecting independent freelancer curiosity with routine digital execution for neighborhood cafes, shops, and startups.
            </p>
          </div>
        </section>

        <section className="bg-[#3f4d71] px-4 py-10 text-white sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-[0.9fr_1fr_1fr_1fr]">
            <h2 className="text-3xl font-black tracking-[-0.04em]">At a Glance</h2>

            <StatCard value="100%" label="Hyperlocal Focus" />
            <StatCard value="5 Stages" label="Verified Pipeline" />
            <StatCard value="₹0 Fees" label="Agency Overhead Removed" />
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <h2 className="mb-8 text-3xl font-black tracking-tighter text-slate-950 sm:text-4xl">
            Platform Core Pillars
          </h2>

          <div className="grid gap-6 md:grid-cols-3">
            <FeatureCard
              icon="🎯"
              title="Cut Business Costs"
              text="Local enterprises bypass expensive agency contracts by micro-allocating recurring digital tasks directly to nearby student talent."
            />
            <FeatureCard
              icon="💡"
              title="Unrestricted Learning"
              text="Freelancers leverage their independent curiosity to execute projects, building verified portfolios and unlocking structured earnings."
            />
            <FeatureCard
              icon="⛓️"
              title="Escrow Verification"
              text="All local gig metrics track through a transparent, 5-stage milestone ledger, securing payments and automating profile trust-tier levels."
            />
          </div>
        </section>
      </main>
    </div>
  );
}

function StatCard({ value, label }) {
  return (
    <div className="border-l border-white/20 pl-5">
      <span className="block text-3xl font-black text-white">{value}</span>
      <span className="mt-1 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-300">
        {label}
      </span>
    </div>
  );
}

function FeatureCard({ icon, title, text }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      <span className="mb-4 block text-3xl">{icon}</span>
      <h3 className="mb-3 text-lg font-bold text-slate-950">{title}</h3>
      <p className="text-sm leading-6 text-slate-600">{text}</p>
    </div>
  );
}
