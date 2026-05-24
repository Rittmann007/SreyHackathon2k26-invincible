import React, { useState } from 'react';

// =========================================================================
// 🧱 SUB-COMPONENT: INTERACTIVE FAQ ACCORDION LIST ROW
// =========================================================================
function FaqSection({ S }) {
  const [activeFaq, setActiveFaq] = useState(null);

  const faqData = [
    {
      q: "How does TaskHive eliminate agency overhead?",
      a: "Agencies charge massive premium retainers. TaskHive links local businesses directly to nearby freelance talent for on-demand task micro-allocation with zero middleman fees."
    },
    {
      q: "What is the 5-Stage Execution Pipeline?",
      a: "Every gig flows through an automated tracker tracking five explicit milestone steps: Pending, In Progress, Revision, Completed, and Paid. This ensures real-time operational alignment."
    },
    {
      q: "How is my capital protected in escrow?",
      a: "When a business posts a task, funds are safely held by the platform's ledger system. Capital is only transferred to the freelancer's balance after the business officially signs off."
    },
    {
      q: "Can freelancers explore different fields freely?",
      a: "Yes! TaskHive empowers independent curiosity. Freelancers can select assignments across diverse domains—video production, coding scripts, or branding layouts—to expand their portfolios."
    }
  ];

  return (
    <div>
      <h2 style={S.sectionHeading}>Frequently Asked Questions</h2>
      <div style={S.faqBlock}>
        {faqData.map((item, i) => {
          const isOpen = activeFaq === i;
          return (
            <div 
              key={i} 
              style={{ ...S.faqRow, backgroundColor: isOpen ? '#f1f5f9' : '#f8fafc', borderColor: isOpen ? '#cbd5e1' : '#e2e8f0' }} 
              onClick={() => setActiveFaq(isOpen ? null : i)}
            >
              <div style={S.faqHeader}>
                <h4 style={S.questionText}>{item.q}</h4>
                <span style={S.toggleArrow(isOpen)}>{isOpen ? "▲" : "▼"}</span>
              </div>
              {isOpen && <div style={S.answerBox} onClick={(e) => e.stopPropagation()}>{item.a}</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// =========================================================================
// 🐝 MAIN CORE EXPORT LANDING INTERFACE
// =========================================================================
export default function Home() {
  const S = {
    container: { fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', backgroundColor: '#ffffff', minHeight: '100vh', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' },
    heroSection: { background: 'linear-gradient(135deg, #74b9ff 0%, #a29bfe 50%, #74b9ff 100%)', color: '#0f172a', padding: '100px 24px 80px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' },
    navBar: { width: '100%', maxWidth: '1100px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'absolute', top: '0', padding: '24px', boxSizing: 'border-box' },
    logo: { margin: 0, fontSize: '1.6rem', fontWeight: '800', color: '#0f172a', letterSpacing: '-1px' },
    navSpace: { fontSize: '0.85rem', fontWeight: '700', color: '#1e293b', letterSpacing: '0.5px' },
    tagline: { fontSize: '2.8rem', fontWeight: '800', margin: '40px 0 12px 0', letterSpacing: '-1.5px', color: '#0f172a' },
    description: { fontSize: '1.15rem', lineHeight: '1.6', color: '#334155', fontWeight: '600', maxWidth: '650px', margin: '0 auto' },
    statsRibbon: { backgroundColor: '#3f4d71', color: '#ffffff', padding: '40px 24px', display: 'flex', justifyContent: 'center', alignItems: 'center' },
    ribbonGrid: { width: '100%', maxWidth: '1100px', display: 'grid', gridTemplateColumns: '0.8fr 1fr 1fr 1fr', gap: '32px', alignItems: 'center' },
    ribbonTitle: { fontSize: '1.6rem', fontWeight: '800', margin: 0, letterSpacing: '-0.5px' },
    statNode: { borderLeft: '1px solid rgba(255, 255, 255, 0.2)', paddingLeft: '20px' },
    statNumber: { fontSize: '1.8rem', fontWeight: '800', color: '#ffffff', display: 'block', margin: '0 0 4px 0' },
    statLabel: { fontSize: '0.85rem', color: '#cbd5e1', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' },
    mainContentSection: { padding: '60px 24px 80px 24px', maxWidth: '1100px', margin: '0 auto', width: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: '56px' },
    sectionHeading: { fontSize: '1.8rem', fontWeight: '800', color: '#0f172a', margin: '0 0 28px 0', letterSpacing: '-1px' },
    featureGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' },
    featureCard: { backgroundColor: '#ffffff', padding: '28px', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)', boxSizing: 'border-box' },
    cardIcon: { fontSize: '1.5rem', marginBottom: '16px', display: 'block' },
    cardTitle: { fontSize: '1.15rem', fontWeight: '700', color: '#0f172a', margin: '0 0 10px 0' },
    cardText: { fontSize: '0.92rem', lineHeight: '1.5', color: '#475569', fontWeight: '500', margin: 0 },
    faqBlock: { width: '100%', display: 'flex', flexDirection: 'column', gap: '14px' },
    faqRow: { border: '1px solid #e2e8f0', borderRadius: '12px', padding: '18px 24px', cursor: 'pointer', transition: 'all 0.2s' },
    faqHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    questionText: { fontSize: '1.05rem', fontWeight: '700', color: '#0f172a', margin: 0 },
    toggleArrow: (open) => ({ fontSize: '0.95rem', fontWeight: '800', color: open ? '#0070f3' : '#64748b' }),
    answerBox: { marginTop: '14px', paddingTop: '14px', borderTop: '1px solid #e2e8f0', fontSize: '0.95rem', lineHeight: '1.6', color: '#475569', fontWeight: '500', textAlign: 'justify' }
  };

  return (
    <div style={S.container}>
      
      {/* 🔮 TOP GRADIENT HERO BANNER */}
      <div style={S.heroSection}>
        <div style={S.navBar}>
          <h2 style={S.logo}>🐝 TaskHive</h2>
          <div style={S.navSpace}>[ LOGIN PORTAL GATEWAY ]</div>
        </div>
        <h1 style={S.tagline}>TaskHive — Home</h1>
        <p style={S.description}>Connecting independent freelancer curiosity with routine digital execution for neighborhood cafes, shops, and startups.</p>
      </div>

      {/* 📊 SEPARATOR STATS RIBBON */}
      <div style={S.statsRibbon}>
        <div style={S.ribbonGrid}>
          <h2 style={S.ribbonTitle}>At a Glance</h2>
          <div style={S.statNode}><span style={S.statNumber}>100%</span><span style={S.statLabel}>Hyperlocal Focus</span></div>
          <div style={S.statNode}><span style={S.statNumber}>5 Stages</span><span style={S.statLabel}>Verified Pipeline</span></div>
          <div style={S.statNode}><span style={S.statNumber}>₹0 Fees</span><span style={S.statLabel}>Overhead Removed</span></div>
        </div>
      </div>

      {/* 🧱 LOWER CONTENT CONTAINER BLOCK */}
      <div style={S.mainContentSection}>
        <div>
          <h2 style={S.sectionHeading}>Platform Highlights</h2>
          <div style={S.featureGrid}>
            <div style={S.featureCard}>
              <span style={S.cardIcon}>🎯</span><h4 style={S.cardTitle}>Cut Business Costs</h4>
              <p style={S.cardText}>Local enterprises bypass expensive agency contracts by micro-allocating recurring tasks directly to nearby student talent.</p>
            </div>
            <div style={S.featureCard}>
              <span style={S.cardIcon}>💡</span><h4 style={S.cardTitle}>Unrestricted Learning</h4>
              <p style={S.cardText}>Freelancers leverage their independent curiosity to execute projects, building verified portfolios and unlocking structured earnings.</p>
            </div>
            <div style={S.featureCard}>
              <span style={S.cardIcon}>⛓️</span><h4 style={S.cardTitle}>Escrow Verification</h4>
              <p style={S.cardText}>All local gig metrics track through a transparent, 5-stage milestone ledger, securing payments and automating profile trust levels.</p>
            </div>
          </div>
        </div>

        {/* MOUNT INTERACTIVE EXTRACTED FAQ NODE */}
        <FaqSection S={S} />
      </div>

    </div>
  );
}

