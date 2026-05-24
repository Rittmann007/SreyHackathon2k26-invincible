import React, { useState, useRef } from 'react';
import Navbar from './Navbar';

const HL_DATA = [
  { id: 0, icon: "🎯", title: "Cut Business Costs", text: "Local enterprises bypass expensive agency contracts by micro-allocating recurring digital tasks directly to nearby student talent.", bullets: ["Eliminates monthly agency retainer overhead.", "On-demand pricing: pay for exact deliverables.", "Zero long-term contractual liabilities.", "Slashes sourcing costs via localized pools.", "Keeps micro-budgets fluid for immediate growth."] },
  { id: 1, icon: "💡", title: "Unrestricted Learning", text: "Freelancers leverage their independent curiosity to execute projects, building verified portfolios and unlocking structured earnings.", bullets: ["Freedom to experiment across tech fields.", "Bridges academic theory with live market needs.", "Earn income dynamically based on outputs.", "Builds an unforgeable track record data.", "Fosters rapid growth outside classrooms."] },
  { id: 2, icon: "⛓️", title: "Escrow Verification", text: "All local gig metrics track through a transparent, 5-stage milestone ledger, securing payments and automating profile trust-tier levels.", bullets: ["Funds locked safely in escrow before launch.", "Guarantees instant payouts on sign-off.", "Complete leverage over milestone assets.", "Removes payment disputes through logs.", "Automates credit scoring within trust tiers."] }
];

const FAQ_DATA = [
  { q: "How does TaskHive eliminate agency overhead?", a: "Agencies charge massive premium retainers. TaskHive links local businesses directly to nearby freelance talent for on-demand task micro-allocation with zero middleman fees." },
  { q: "What is the 5-Stage Execution Pipeline?", a: "Every gig flows through an automated tracker tracking five explicit milestone steps: Pending, In Progress, Revision, Completed, and Paid. This ensures real-time operational alignment." },
  { q: "How is my capital protected in escrow?", a: "When a business posts a task, funds are safely held by the platform's ledger system. Capital is only transferred to the freelancer's balance after the business officially signs off." },
  { q: "Can freelancers explore different fields freely?", a: "Yes! TaskHive empowers independent curiosity. Freelancers can select assignments across diverse domains—video production, coding scripts, or branding layouts—to expand their portfolios." }
];

export default function Home() {
  const [flipped, setFlipped] = useState({});
  const [activeFaq, setActiveFaq] = useState(null);
  const highlightsSectionRef = useRef(null);

  const handleScrollToHighlights = () => {
    highlightsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans flex flex-col justify-start">
      <Navbar />

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* HERO SECTION CONTAINER */}
        <section className="relative overflow-hidden bg-[linear-gradient(135deg,#74b9ff_0%,#a29bfe_50%,#74b9ff_100%)] rounded-3xl mt-4 px-4 py-16 text-center shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),transparent_30%),radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_26%),linear-gradient(120deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02)_40%,rgba(255,255,255,0.12))]" />
          <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center">
            <h1 className="text-6xl font-black tracking-tighter text-slate-950 sm:text-7xl lg:text-8xl drop-shadow-sm select-none">
              TaskHive
            </h1>
            <p className="mt-4 max-w-3xl text-base font-semibold leading-8 text-slate-800 sm:text-lg lg:text-xl">
              Connecting independent freelancer curiosity with routine digital execution for neighborhood cafes, shops, and startups.
            </p>
          </div>
        </section>

        {/* METRICS AT A GLANCE BANNER RIBBON */}
        <section className="bg-[#3f4d71] rounded-3xl mt-4 px-6 py-6 text-white shadow-sm">
          <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-[0.9fr_1fr_1fr_1fr] items-center">
            <h2 className="text-2xl font-black tracking-[-0.04em] text-white" style={{ color: '#ffffff', margin: 0 }}>At a Glance</h2>
            <div className="border-l border-white/20 pl-5"><span className="block text-2xl font-black text-white">100%</span><span className="mt-0.5 block text-[10px] font-bold uppercase tracking-wider text-slate-300">Hyperlocal Focus</span></div>
            <div className="border-l border-white/20 pl-5"><span className="block text-2xl font-black text-white">5 Stages</span><span className="mt-0.5 block text-[10px] font-bold uppercase tracking-wider text-slate-300">Verified Pipeline</span></div>
            <div className="border-l border-white/20 pl-5"><span className="block text-2xl font-black text-white">₹0 Fees</span><span className="mt-0.5 block text-[10px] font-bold uppercase tracking-wider text-slate-300">Overhead Removed</span></div>
          </div>
        </section>

        {/* PRIMARY HIGHLIGHTS FLIP CARD GRID */}
        <section ref={highlightsSectionRef} className="py-10 mt-2">
          <div className="flex items-center gap-3 mb-6 select-none justify-center md:justify-start">
            <h2 className="text-3xl font-black tracking-tighter text-slate-950 sm:text-4xl m-0">Primary Highlights</h2>
            <button onClick={handleScrollToHighlights} className="inline-flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-[#0070f3] w-9 h-9 rounded-full font-black text-sm border border-slate-200/60 cursor-pointer shadow-sm transition duration-200 active:scale-95 animate-bounce mt-1">▼</button>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {HL_DATA.map((c) => {
              const flip = !!flipped[c.id];
              return (
                <div key={c.id} className={`rounded-2xl border p-7 transition-all duration-300 transform min-h-62.5 flex flex-col justify-between ${flip ? 'bg-[linear-gradient(135deg,#74b9ff_0%,#a29bfe_100%)] border-white/40 text-slate-950 scale-[1.02] shadow-lg' : 'border-slate-200 bg-white text-slate-600 shadow-[0_10px_30px_rgba(0,0,0,0.01)]'}`}>
                  <div className="flex justify-between items-start w-full">
                    <div><span className="mb-2 block text-3xl">{c.icon}</span><h3 className="text-lg font-black text-slate-950 tracking-tight">{c.title}</h3></div>
                    <button onClick={() => setFlipped(p => ({ ...p, [c.id]: !p[c.id] }))} className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-lg shadow-sm border border-slate-200/50 cursor-pointer transition-all duration-200 ${flip ? 'bg-slate-950/10 text-slate-950 rotate-45' : 'bg-slate-100 text-[#0070f3]'}`}>+</button>
                  </div>
                  <div className="mt-4 grow flex items-start">{!flip ? <p className="text-sm leading-6 font-medium text-justify text-slate-600">{c.text}</p> : <ul className="list-disc pl-5 text-xs font-bold leading-5 space-y-1.5 text-left text-slate-950">{c.bullets.map((b, idx) => <li key={idx}>{b}</li>)}</ul>}</div>
                </div>
              );
            })}
          </div>
        </section>

        {/* INTERACTIVE ACCORDION FAQ ROW LAYOUT */}
        <section className="pb-12">
          <h2 className="mb-6 text-3xl font-black tracking-tighter text-slate-950 sm:text-4xl text-center md:text-left">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {FAQ_DATA.map((item, index) => {
              const isOpen = activeFaq === index;
              return (
                <div key={index} onClick={() => setActiveFaq(isOpen ? null : index)} className={`group rounded-2xl border cursor-pointer p-5 transition-all duration-200 ease-in-out select-none ${isOpen ? 'border-slate-300 bg-slate-50 shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'}`}>
                  <div className="flex items-center justify-between gap-4">
                    <h4 className="text-base font-bold text-slate-950">{item.q}</h4>
                    <span className={`text-xs font-black transition-transform duration-200 ${isOpen ? 'text-[#0070f3] rotate-180' : 'text-slate-400 group-hover:text-slate-600'}`}>{isOpen ? '▲' : '▼'}</span>
                  </div>
                  {isOpen && (
                    <div onClick={(e) => e.stopPropagation()} className="mt-4 pt-4 border-t border-slate-200/80 text-sm font-medium leading-7 text-slate-600 text-justify">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ABOUT US SECTION */}
        <section className="pb-20">
          <h2 className="mb-6 text-3xl font-black tracking-tighter text-slate-950 sm:text-4xl text-center md:text-left">About Us</h2>
          <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-8 flex flex-col md:flex-row gap-6 items-center shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
            <div className="text-4xl bg-white w-16 h-16 rounded-2xl flex items-center justify-center border border-slate-200/80 shadow-sm select-none">🛡️</div>
            <div className="flex-1">
              <h3 className="text-xl font-extrabold text-slate-950 mb-2" style={{ margin: '0 0 8px 0' }}>Team Invincible</h3>
              <p className="text-sm font-medium leading-7 text-slate-600 text-justify" style={{ margin: 0 }}>
                We are Team Invincible, an agile engineering collective dedicated to developing highly practical solutions to critical real-world inefficiencies. By bridging cutting-edge technology stacks with localized socio-economic models, our mission centers on engineering highly reliable platform systems that optimize business output, protect transaction capital, and empower decentralized human potential.
              </p>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
