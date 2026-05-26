import React, { useState, useMemo } from 'react';

// Category color mappings
const CATEGORY_COLORS = {
  Salary: { stroke: '#10b981', glow: 'rgba(16, 185, 129, 0.4)' },
  Investment: { stroke: '#06b6d4', glow: 'rgba(6, 182, 212, 0.4)' },
  Food: { stroke: '#f43f5e', glow: 'rgba(244, 63, 94, 0.4)' },
  Utilities: { stroke: '#f59e0b', glow: 'rgba(245, 158, 11, 0.4)' },
  Entertainment: { stroke: '#a855f7', glow: 'rgba(168, 85, 247, 0.4)' },
  Travel: { stroke: '#ec4899', glow: 'rgba(236, 72, 153, 0.4)' },
  Shopping: { stroke: '#3b82f6', glow: 'rgba(59, 130, 246, 0.4)' },
  Health: { stroke: '#14b8a6', glow: 'rgba(20, 184, 166, 0.4)' },
  Miscellaneous: { stroke: '#64748b', glow: 'rgba(100, 116, 139, 0.4)' }
};

export default function ExpenseChart({ transactions }) {
  const [activeCategory, setActiveCategory] = useState(null);
  const [hoveredTrendIndex, setHoveredTrendIndex] = useState(null);

  // Group and process expenses by category
  const categoryData = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense');
    const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);

    if (totalExpenses === 0) return [];

    const grouped = {};
    expenses.forEach(t => {
      grouped[t.category] = (grouped[t.category] || 0) + t.amount;
    });

    const list = Object.entries(grouped).map(([category, amount]) => ({
      name: category,
      amount,
      percentage: parseFloat(((amount / totalExpenses) * 100).toFixed(1)),
      color: CATEGORY_COLORS[category] || { stroke: '#a855f7', glow: 'rgba(168, 85, 247, 0.4)' }
    }));

    return list.sort((a, b) => b.amount - a.amount);
  }, [transactions]);

  // Compute trend data (cumulative balance over time)
  const trendData = useMemo(() => {
    if (transactions.length === 0) return [];

    // Sort transactions chronologically
    const chron = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));
    
    let runningBalance = 0;
    const history = chron.map((t, idx) => {
      if (t.type === 'income') {
        runningBalance += t.amount;
      } else {
        runningBalance -= t.amount;
      }
      return {
        id: t.id,
        date: t.date,
        description: t.description,
        amount: t.amount,
        type: t.type,
        balance: runningBalance
      };
    });

    // Limit to latest 10 data points for UI clarity
    return history.slice(-10);
  }, [transactions]);

  // SVG parameters for Donut Chart
  const radius = 50;
  const circumference = 2 * Math.PI * radius; // ~314.159

  // SVG parameters for Area Trend Chart
  const trendWidth = 500;
  const trendHeight = 200;
  const padding = { top: 20, right: 30, bottom: 40, left: 50 };

  const trendCoords = useMemo(() => {
    if (trendData.length < 2) return [];

    const balances = trendData.map(d => d.balance);
    const minBal = Math.min(...balances, 0); // Include 0 as floor
    const maxBal = Math.max(...balances, 100);
    const range = maxBal - minBal || 1;

    const chartW = trendWidth - padding.left - padding.right;
    const chartH = trendHeight - padding.top - padding.bottom;

    return trendData.map((d, index) => {
      const x = padding.left + (index * (chartW / (trendData.length - 1)));
      const y = padding.top + chartH - ((d.balance - minBal) / range) * chartH;
      return { x, y, ...d };
    });
  }, [trendData]);

  // Create SVG path for Area Chart (with beautiful smoothing lines)
  const trendPathData = useMemo(() => {
    if (trendCoords.length < 2) return '';
    let d = `M ${trendCoords[0].x} ${trendCoords[0].y}`;
    
    // Smooth Bézier curve calculation
    for (let i = 0; i < trendCoords.length - 1; i++) {
      const curr = trendCoords[i];
      const next = trendCoords[i + 1];
      const cpX1 = curr.x + (next.x - curr.x) / 3;
      const cpY1 = curr.y;
      const cpX2 = curr.x + 2 * (next.x - curr.x) / 3;
      const cpY2 = next.y;
      d += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${next.x} ${next.y}`;
    }
    return d;
  }, [trendCoords]);

  // Create closed filled area path for the chart gradient
  const trendAreaPathData = useMemo(() => {
    if (trendCoords.length < 2) return '';
    const bottomY = trendHeight - padding.bottom;
    return `${trendPathData} L ${trendCoords[trendCoords.length - 1].x} ${bottomY} L ${trendCoords[0].x} ${bottomY} Z`;
  }, [trendCoords, trendPathData]);

  // Calculate Donut circle strokes
  let accumulatedPercent = 0;

  return (
    <div className="dashboard-grid" style={{ marginTop: '0rem', marginBottom: '2rem' }}>
      
      {/* Spend Breakdown Donut Chart */}
      <div className="glass-card widget-half" style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Spending Breakdown</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Distribution across active categories</p>
          </div>
        </div>

        {categoryData.length === 0 ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '220px', color: 'var(--text-muted)' }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ opacity: 0.4, marginBottom: '0.75rem' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z" />
            </svg>
            <span style={{ fontSize: '0.9rem' }}>No expenses recorded yet</span>
          </div>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '2rem', flex: 1, minHeight: '220px' }}>
            
            {/* SVG Donut */}
            <div style={{ position: 'relative', width: '170px', height: '170px' }}>
              <svg width="100%" height="100%" viewBox="0 0 120 120">
                <defs>
                  <filter id="glow-effect" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>
                
                {/* Background base circle */}
                <circle
                  cx="60"
                  cy="60"
                  r={radius}
                  fill="transparent"
                  stroke="rgba(255, 255, 255, 0.03)"
                  strokeWidth="8"
                />

                {/* Render slices */}
                {categoryData.map((cat, idx) => {
                  const percent = cat.percentage;
                  const strokeOffset = circumference - (percent / 100) * circumference;
                  const rotationAngle = (accumulatedPercent / 100) * 360 - 90;
                  accumulatedPercent += percent;

                  const isActive = activeCategory === cat.name;

                  return (
                    <circle
                      key={cat.name}
                      cx="60"
                      cy="60"
                      r={radius}
                      fill="transparent"
                      stroke={cat.color.stroke}
                      strokeWidth={isActive ? 13 : 9}
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeOffset}
                      transform={`rotate(${rotationAngle} 60 60)`}
                      strokeLinecap="round"
                      style={{
                        cursor: 'pointer',
                        transition: 'stroke-width 0.3s cubic-bezier(0.4, 0, 0.2, 1), stroke 0.3s',
                        filter: isActive ? 'url(#glow-effect)' : 'none'
                      }}
                      onMouseEnter={() => setActiveCategory(cat.name)}
                      onMouseLeave={() => setActiveCategory(null)}
                    />
                  );
                })}
              </svg>

              {/* Central Text Panel */}
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center',
                pointerEvents: 'none',
                width: '100px'
              }}>
                {activeCategory ? (
                  <>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>{activeCategory}</p>
                    <p style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-white)' }}>
                      {categoryData.find(c => c.name === activeCategory)?.percentage}%
                    </p>
                  </>
                ) : (
                  <>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>Total Spent</p>
                    <p style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-white)' }}>
                      ${categoryData.reduce((sum, c) => sum + c.amount, 0).toLocaleString()}
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* List Legend */}
            <div style={{ flex: 1, minWidth: '160px', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {categoryData.slice(0, 5).map((cat) => {
                const isActive = activeCategory === cat.name;
                return (
                  <div
                    key={cat.name}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.4rem 0.6rem',
                      borderRadius: '8px',
                      background: isActive ? 'rgba(255, 255, 255, 0.04)' : 'transparent',
                      cursor: 'pointer',
                      transition: 'var(--transition)'
                    }}
                    onMouseEnter={() => setActiveCategory(cat.name)}
                    onMouseLeave={() => setActiveCategory(null)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{
                        display: 'inline-block',
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: cat.color.stroke,
                        boxShadow: `0 0 8px ${cat.color.stroke}`
                      }} />
                      <span style={{ fontSize: '0.85rem', fontWeight: 500, color: isActive ? 'var(--text-white)' : 'var(--text-muted)' }}>
                        {cat.name}
                      </span>
                    </div>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-white)' }}>
                      ${cat.amount.toLocaleString()}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Cash Flow Timeline Trend Chart */}
      <div className="glass-card widget-half" style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Wealth Timeline</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Net balance trajectory over active records</p>
          </div>
        </div>

        {trendData.length < 2 ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '220px', color: 'var(--text-muted)' }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ opacity: 0.4, marginBottom: '0.75rem' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
            </svg>
            <span style={{ fontSize: '0.9rem' }}>Add multiple transactions to view timeline</span>
          </div>
        ) : (
          <div style={{ position: 'relative', width: '100%', flex: 1, minHeight: '220px' }}>
            <svg width="100%" height="100%" viewBox={`0 0 ${trendWidth} ${trendHeight}`} preserveAspectRatio="xMidYMid meet">
              <defs>
                {/* Area Gradient fill */}
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.0" />
                </linearGradient>
                {/* Line Glow Filter */}
                <filter id="line-glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Grid Lines */}
              <line
                x1={padding.left}
                y1={padding.top}
                x2={trendWidth - padding.right}
                y2={padding.top}
                stroke="rgba(255, 255, 255, 0.03)"
                strokeWidth="1"
              />
              <line
                x1={padding.left}
                y1={(trendHeight - padding.bottom + padding.top) / 2}
                x2={trendWidth - padding.right}
                y2={(trendHeight - padding.bottom + padding.top) / 2}
                stroke="rgba(255, 255, 255, 0.03)"
                strokeWidth="1"
              />
              <line
                x1={padding.left}
                y1={trendHeight - padding.bottom}
                x2={trendWidth - padding.right}
                y2={trendHeight - padding.bottom}
                stroke="rgba(255, 255, 255, 0.06)"
                strokeWidth="1"
              />

              {/* Render Area Fill */}
              <path d={trendAreaPathData} fill="url(#areaGrad)" style={{ transition: 'd 0.3s ease' }} />

              {/* Render Trend Line */}
              <path
                d={trendPathData}
                fill="none"
                stroke="var(--primary)"
                strokeWidth="3.5"
                filter="url(#line-glow)"
                style={{ transition: 'd 0.3s ease' }}
              />

              {/* Interactive Hover Vertical Guidelines & Circles */}
              {trendCoords.map((pt, idx) => {
                const isHovered = hoveredTrendIndex === idx;

                return (
                  <g key={pt.id} onMouseEnter={() => setHoveredTrendIndex(idx)} onMouseLeave={() => setHoveredTrendIndex(null)}>
                    {/* Invisible overlay wider bar for easy hovering */}
                    <rect
                      x={pt.x - 15}
                      y={padding.top}
                      width="30"
                      height={trendHeight - padding.top - padding.bottom}
                      fill="transparent"
                      style={{ cursor: 'pointer' }}
                    />
                    
                    {/* Vertical dashed line */}
                    {isHovered && (
                      <line
                        x1={pt.x}
                        y1={padding.top}
                        x2={pt.x}
                        y2={trendHeight - padding.bottom}
                        stroke="rgba(255, 255, 255, 0.15)"
                        strokeWidth="1"
                        strokeDasharray="4 4"
                      />
                    )}

                    {/* Node Dot */}
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={isHovered ? 6 : 4}
                      fill={isHovered ? 'var(--accent)' : 'var(--primary)'}
                      stroke="var(--bg-deep)"
                      strokeWidth="2.5"
                      style={{
                        transition: 'r 0.2s, fill 0.2s',
                        filter: isHovered ? 'drop-shadow(0 0 8px var(--accent))' : 'none'
                      }}
                    />
                  </g>
                );
              })}

              {/* Date Labels (X-Axis) */}
              {trendCoords.length > 0 && [trendCoords[0], trendCoords[Math.floor((trendCoords.length - 1) / 2)], trendCoords[trendCoords.length - 1]].map((pt, i) => {
                if (!pt) return null;
                const formattedDate = new Date(pt.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
                return (
                  <text
                    key={i}
                    x={pt.x}
                    y={trendHeight - 15}
                    fill="var(--text-muted)"
                    fontSize="9.5"
                    fontWeight="500"
                    textAnchor="middle"
                  >
                    {formattedDate}
                  </text>
                );
              })}
            </svg>

            {/* Dynamic Hover Tooltip Overlay */}
            {hoveredTrendIndex !== null && trendCoords[hoveredTrendIndex] && (
              <div style={{
                position: 'absolute',
                top: `${Math.max(0, trendCoords[hoveredTrendIndex].y - 95)}px`,
                left: `${Math.min(trendWidth - 170, Math.max(10, trendCoords[hoveredTrendIndex].x - 80))}px`,
                background: 'rgba(9, 13, 29, 0.95)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '12px',
                padding: '0.65rem 0.85rem',
                zIndex: 10,
                pointerEvents: 'none',
                boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                animation: 'fade-in 0.15s ease-out'
              }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.2rem' }}>
                  {new Date(trendCoords[hoveredTrendIndex].date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                </div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-white)', marginBottom: '0.15rem', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '140px' }}>
                  {trendCoords[hoveredTrendIndex].description}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', fontSize: '0.85rem', marginTop: '0.25rem', paddingTop: '0.25rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>Change</span>
                    <span style={{ fontWeight: 700, color: trendCoords[hoveredTrendIndex].type === 'income' ? 'var(--success)' : 'var(--danger)' }}>
                      {trendCoords[hoveredTrendIndex].type === 'income' ? '+' : '-'}${trendCoords[hoveredTrendIndex].amount}
                    </span>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>Balance</span>
                    <span style={{ fontWeight: 700, color: 'var(--accent)' }}>
                      ${trendCoords[hoveredTrendIndex].balance.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
}
