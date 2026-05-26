import React from 'react';

export default function Dashboard({ transactions }) {
  // Compute totals
  const totals = transactions.reduce((acc, t) => {
    if (t.type === 'income') {
      acc.income += t.amount;
    } else {
      acc.expenses += t.amount;
    }
    return acc;
  }, { income: 0, expenses: 0 });

  const balance = totals.income - totals.expenses;

  return (
    <div className="dashboard-grid" style={{ marginBottom: '1.75rem' }}>
      
      {/* Total Balance Card */}
      <div className="glass-card widget-third" style={{
        borderLeft: '4px solid var(--accent)',
        boxShadow: '0 8px 32px 0 rgba(0, 240, 255, 0.08)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Total Balance
            </p>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.5rem', color: 'var(--text-white)' }}>
              ${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h2>
          </div>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'var(--accent-glow)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px var(--accent-glow)'
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <line x1="12" y1="10" x2="12" y2="14" />
              <line x1="8" y1="12" x2="16" y2="12" />
            </svg>
          </div>
        </div>
      </div>

      {/* Total Income Card */}
      <div className="glass-card widget-third" style={{
        borderLeft: '4px solid var(--success)',
        boxShadow: '0 8px 32px 0 rgba(16, 185, 129, 0.08)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Total Income
            </p>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.5rem', color: 'var(--success)' }}>
              +${totals.income.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h2>
          </div>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'var(--success-glow)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px var(--success-glow)'
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 19V5M5 12l7-7 7 7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Total Expenses Card */}
      <div className="glass-card widget-third" style={{
        borderLeft: '4px solid var(--danger)',
        boxShadow: '0 8px 32px 0 rgba(244, 63, 94, 0.08)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Total Expenses
            </p>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.5rem', color: 'var(--danger)' }}>
              -${totals.expenses.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h2>
          </div>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'var(--danger-glow)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px var(--danger-glow)'
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </div>
        </div>
      </div>

    </div>
  );
}
