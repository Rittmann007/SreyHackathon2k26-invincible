import React from 'react';

export default function Home() {
  const styles = {
    container: {
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      backgroundColor: '#ffffff', // Keeps the lower portion a clean corporate white
      minHeight: '100vh',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column'
    },
    
    // 🔮 THEME-SYNCHRONIZED HERO BANNER (Matches dynamic glassmorphic backgrounds)
    heroSection: {
      background: 'linear-gradient(135deg, #74b9ff 0%, #a29bfe 50%, #74b9ff 100%)', // Vibrant mesh backdrop
      color: '#0f172a', // High-contrast text
      padding: '100px 24px 80px 24px',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative'
    },
    navBar: {
      width: '100%',
      maxWidth: '1100px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'absolute',
      top: '0',
      padding: '24px',
      boxSizing: 'border-box'
    },
    logo: { margin: 0, fontSize: '1.6rem', fontWeight: '800', color: '#0f172a', letterSpacing: '-1px' },
    navSpace: { fontSize: '0.85rem', fontWeight: '700', color: '#1e293b', letterSpacing: '0.5px' },
    tagline: { fontSize: '2.8rem', fontWeight: '800', margin: '40px 0 12px 0', letterSpacing: '-1.5px', color: '#0f172a' },
    description: { fontSize: '1.15rem', lineHeight: '1.6', color: '#334155', fontWeight: '600', maxWidth: '650px', margin: '0 auto' },
    
    // 📊 MODULE 2: AT A GLANCE RIBBON BAR
    statsRibbon: {
      backgroundColor: '#3f4d71', 
      color: '#ffffff',
      padding: '40px 24px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    ribbonGrid: {
      width: '100%',
      maxWidth: '1100px',
      display: 'grid',
      gridTemplateColumns: '0.8fr 1fr 1fr 1fr', 
      gap: '32px',
      alignItems: 'center'
    },
    ribbonTitle: { fontSize: '1.6rem', fontWeight: '800', margin: 0, letterSpacing: '-0.5px' },
    statNode: { borderLeft: '1px solid rgba(255, 255, 255, 0.2)', paddingLeft: '20px' },
    statNumber: { fontSize: '1.8rem', fontWeight: '800', color: '#ffffff', display: 'block', margin: '0 0 4px 0' },
    statLabel: { fontSize: '0.85rem', color: '#cbd5e1', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' },
    
    // 🧱 MODULE 3: WHITE BACKGROUND FEATURE CORE MATRIX
    featuresSection: {
      padding: '60px 24px',
      maxWidth: '1100px',
      margin: '0 auto',
      width: '100%',
      boxSizing: 'border-box'
    },
    gridTitle: { fontSize: '1.8rem', fontWeight: '800', color: '#0f172a', margin: '0 0 32px 0', letterSpacing: '-1px' },
    featureGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)', 
      gap: '24px'
    },
    featureCard: {
      backgroundColor: '#ffffff',
      padding: '28px',
      borderRadius: '8px',
      border: '1px solid #e2e8f0', 
      boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
      boxSizing: 'border-box'
    },
    cardIcon: { fontSize: '1.5rem', marginBottom: '16px', display: 'block' },
    cardTitle: { fontSize: '1.15rem', fontWeight: '700', color: '#0f172a', margin: '0 0 10px 0' },
    cardText: { fontSize: '0.92rem', lineHeight: '1.5', color: '#475569', fontWeight: '500', margin: 0 }
  };

  return (
    <div style={styles.container}>
      
      {/* SECTION 1: SYNCHRONIZED GRADIENT CANVAS BACKDROP */}
      <div style={styles.heroSection}>
        <div style={styles.navBar}>
          <h2 style={styles.logo}>🐝 TaskHive</h2>
          <div style={styles.navSpace}>[ LOGIN PORTAL GATEWAY ]</div>
        </div>
        
        <h1 style={styles.tagline}>TaskHive</h1>
        <p style={styles.description}>
          Connecting independent freelancer curiosity with routine digital execution for neighborhood cafes, shops, and startups.
        </p>
      </div>

      {/* SECTION 2: SOLID SEPARATOR STATUS METRIC RIBBON */}
      <div style={styles.statsRibbon}>
        <div style={styles.ribbonGrid}>
          <h2 style={styles.ribbonTitle}>At a Glance</h2>
          
          <div style={styles.statNode}>
            <span style={styles.statNumber}>100%</span>
            <span style={styles.statLabel}>Hyperlocal Focus</span>
          </div>
          
          <div style={styles.statNode}>
            <span style={styles.statNumber}>5 Stages</span>
            <span style={styles.statLabel}>Verified Pipeline</span>
          </div>
          
          <div style={styles.statNode}>
            <span style={styles.statNumber}>₹0 Fees</span>
            <span style={styles.statLabel}>Agency Overhead Removed</span>
          </div>
        </div>
      </div>

      {/* SECTION 3: IMMUTABLE SOLID WHITE DECK ROWS */}
      <div style={styles.featuresSection}>
        <h2 style={styles.gridTitle}>Platform Core Pillars</h2>
        
        <div style={styles.featureGrid}>
          <div style={styles.featureCard}>
            <span style={styles.cardIcon}>🎯</span>
            <h4 style={styles.cardTitle}>Cut Business Costs</h4>
            <p style={styles.cardText}>
              Local enterprises bypass expensive agency contracts by micro-allocating recurring digital tasks directly to nearby student talent.
            </p>
          </div>

          <div style={styles.featureCard}>
            <span style={styles.cardIcon}>💡</span>
            <h4 style={styles.cardTitle}>Unrestricted Learning</h4>
            <p style={styles.cardText}>
              Freelancers leverage their independent curiosity to execute projects, building verified portfolios and unlocking structured earnings.
            </p>
          </div>

          <div style={styles.featureCard}>
            <span style={styles.cardIcon}>⛓️</span>
            <h4 style={styles.cardTitle}>Escrow Verification</h4>
            <p style={styles.cardText}>
              All local gig metrics track through a transparent, 5-stage milestone ledger, securing payments and automating profile trust-tier levels.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
