import React, { useState, useMemo } from 'react';

const TRACKED_CATEGORIES = ['Food', 'Utilities', 'Entertainment', 'Travel', 'Shopping'];

export default function BudgetTracker({ transactions, budgets, onUpdateBudget }) {
  const [editingCategory, setEditingCategory] = useState(null);
  const [inputValue, setInputValue] = useState('');

  // Group and sum expenses for tracked categories
  const spending = useMemo(() => {
    const expenseSum = {};
    TRACKED_CATEGORIES.forEach(c => { expenseSum[c] = 0; });

    transactions.forEach(t => {
      if (t.type === 'expense' && TRACKED_CATEGORIES.includes(t.category)) {
        expenseSum[t.category] += t.amount;
      }
    });

    return expenseSum;
  }, [transactions]);

  const handleEditClick = (category) => {
    setEditingCategory(category);
    setInputValue(budgets[category]?.toString() || '0');
  };

  const handleSave = (e) => {
    e.preventDefault();
    const parsed = parseFloat(inputValue);
    if (!isNaN(parsed) && parsed >= 0 && editingCategory) {
      onUpdateBudget(editingCategory, parsed);
      setEditingCategory(null);
    }
  };

  return (
    <div className="glass-card widget-half" style={{ display: 'flex', flexDirection: 'column' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Monthly Budgets</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Spend thresholds per category</p>
        </div>
      </div>

      {/* Budgets Progress List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', flex: 1 }}>
        {TRACKED_CATEGORIES.map(category => {
          const spent = spending[category] || 0;
          const limit = budgets[category] || 0;
          const percent = limit > 0 ? parseFloat(((spent / limit) * 100).toFixed(1)) : 0;
          const isOver = spent > limit && limit > 0;

          // Determine progress bar styling gradients based on threshold percentage
          let progressColor = 'var(--success-gradient)';
          let progressGlow = 'var(--success-glow)';
          if (percent >= 70 && percent < 90) {
            progressColor = 'var(--warning-gradient)';
            progressGlow = 'var(--warning-glow)';
          } else if (percent >= 90) {
            progressColor = 'var(--danger-gradient)';
            progressGlow = 'var(--danger-glow)';
          }

          return (
            <div key={category} style={{
              background: 'rgba(255, 255, 255, 0.01)',
              border: '1px solid rgba(255, 255, 255, 0.03)',
              borderRadius: '14px',
              padding: '0.9rem 1.1rem',
              transition: 'var(--transition)'
            }}>
              {/* Category Info Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                <div>
                  <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-white)' }}>
                    {category}
                  </span>
                  {limit === 0 && (
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>
                      (No limit set)
                    </span>
                  )}
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    color: isOver ? 'var(--danger)' : 'var(--text-muted)'
                  }}>
                    ${spent.toLocaleString()} / ${limit > 0 ? limit.toLocaleString() : '—'}
                  </span>

                  <button
                    onClick={() => handleEditClick(category)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      padding: '0.2rem',
                      display: 'flex',
                      alignItems: 'center',
                      borderRadius: '4px',
                      transition: 'var(--transition)'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                    aria-label={`Adjust budget for ${category}`}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 20h9M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Progress Track */}
              {limit > 0 && (
                <div>
                  <div style={{
                    width: '100%',
                    height: '8px',
                    borderRadius: '4px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${Math.min(100, percent)}%`,
                      height: '100%',
                      borderRadius: '4px',
                      background: progressColor,
                      boxShadow: `0 0 8px ${progressGlow}`,
                      transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                    }} />
                  </div>
                  
                  {/* Status Indicator */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.4rem', fontSize: '0.75rem' }}>
                    <span style={{ color: percent >= 90 ? 'var(--danger)' : 'var(--text-muted)', fontWeight: percent >= 90 ? 700 : 500 }}>
                      {percent}% Used
                    </span>
                    {isOver && (
                      <span style={{ color: 'var(--danger)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <circle cx="12" cy="12" r="10" />
                          <line x1="12" y1="8" x2="12" y2="12" />
                          <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                        Limit Exceeded!
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Quick Budget Editor Drawer overlay */}
      {editingCategory && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(7, 10, 20, 0.9)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem',
          zIndex: 10,
          animation: 'fade-in 0.2s ease-in-out'
        }}>
          <form onSubmit={handleSave} style={{ width: '100%', maxWidth: '300px' }}>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', textAlign: 'center' }}>
              Set Budget: <span style={{ color: 'var(--accent)' }}>{editingCategory}</span>
            </h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '1.25rem' }}>
              Define your maximum expense ceiling
            </p>
            
            <div className="input-group">
              <input
                type="number"
                className="form-input"
                placeholder="Limit amount ($)"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                autoFocus
              />
            </div>
            
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button type="button" className="btn btn-secondary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }} onClick={() => setEditingCategory(null)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}>
                Save Budget
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
