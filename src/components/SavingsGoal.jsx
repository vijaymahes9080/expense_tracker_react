import React, { useState } from 'react';

export default function SavingsGoal({ goal, onUpdateGoal, currency }) {
  const [showAddFunds, setShowAddFunds] = useState(false);
  const [showEditGoal, setShowEditGoal] = useState(false);
  
  const [fundsAmount, setFundsAmount] = useState('');
  const [fundsAction, setFundsAction] = useState('add'); // 'add' or 'withdraw'

  const [editName, setEditName] = useState(goal.name);
  const [editTarget, setEditTarget] = useState(goal.target.toString());

  const percent = goal.target > 0 ? Math.min(100, parseFloat(((goal.saved / goal.target) * 100).toFixed(1))) : 0;

  const handleFundsSubmit = (e) => {
    e.preventDefault();
    const parsed = parseFloat(fundsAmount);
    if (!isNaN(parsed) && parsed > 0) {
      const newSaved = fundsAction === 'add' 
        ? goal.saved + parsed 
        : Math.max(0, goal.saved - parsed);
      
      onUpdateGoal({
        ...goal,
        saved: newSaved
      }, {
        action: fundsAction,
        amount: parsed,
        name: goal.name
      });
      setFundsAmount('');
      setShowAddFunds(false);
    }
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    const parsedTarget = parseFloat(editTarget);
    if (editName.trim() && !isNaN(parsedTarget) && parsedTarget > 0) {
      onUpdateGoal({
        ...goal,
        name: editName.trim(),
        target: parsedTarget
      }, null);
      setShowEditGoal(false);
    }
  };

  const openFundsModal = (action) => {
    setFundsAction(action);
    setFundsAmount('');
    setShowAddFunds(true);
  };

  // Determine wave coordinates based on percentage (height is 120px)
  // 100% saved = y-coordinate is 10 (top of cylinder)
  // 0% saved = y-coordinate is 110 (bottom of cylinder)
  const liquidHeight = (percent / 100) * 100; // max fill height is 100px
  const yFill = 110 - liquidHeight;

  return (
    <div className="glass-card widget-half" style={{ display: 'flex', flexDirection: 'column' }}>
      
      {/* Title Panel */}
      <div style={{ marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Savings Vault</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Secure funding for targeted benchmarks</p>
        </div>
        <button
          onClick={() => setShowEditGoal(true)}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '0.35rem',
            borderRadius: '8px',
            transition: 'var(--transition)'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
          aria-label="Edit savings goal"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20h9M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
          </svg>
        </button>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        
        {/* Animated Cylinder Visual representation */}
        <div style={{ position: 'relative', width: '100px', height: '140px', display: 'flex', justifyContent: 'center' }}>
          <svg width="90" height="130" viewBox="0 0 90 130">
            <defs>
              {/* Cylinder liquid gradient */}
              <linearGradient id="liquidGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00f0ff" />
                <stop offset="100%" stopColor="#8a2be2" />
              </linearGradient>

              {/* Cylindrical Mask */}
              <clipPath id="flaskClip">
                <rect x="15" y="10" width="60" height="100" rx="30" />
              </clipPath>
            </defs>

            {/* Cylinder Glass Outline */}
            <rect
              x="15"
              y="10"
              width="60"
              height="100"
              rx="30"
              fill="rgba(255, 255, 255, 0.02)"
              stroke="rgba(255, 255, 255, 0.12)"
              strokeWidth="2.5"
            />

            {/* Flask base shadow / glowing support */}
            <path d="M15 110 C 15 120, 75 120, 75 110" fill="none" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="1.5" />

            {/* Cylindrical liquid content */}
            <g clipPath="url(#flaskClip)">
              {percent > 0 && (
                <>
                  {/* Liquid fill base */}
                  <rect
                    x="15"
                    y={yFill}
                    width="60"
                    height={liquidHeight}
                    fill="url(#liquidGrad)"
                    opacity="0.8"
                    style={{ transition: 'y 0.5s ease, height 0.5s ease' }}
                  />

                  {/* Liquid top animated wave path */}
                  <path
                    d={`M -40 ${yFill} 
                       Q -20 ${yFill - 4} 0 ${yFill} 
                       T 40 ${yFill} 
                       T 80 ${yFill} 
                       T 120 ${yFill} 
                       L 120 120 
                       L -40 120 Z`}
                    fill="url(#liquidGrad)"
                    opacity="0.9"
                    style={{
                      transition: 'y 0.5s ease',
                      transform: 'translateX(0)',
                      animation: 'liquid-wave 4s linear infinite'
                    }}
                  />
                </>
              )}
            </g>

            {/* Sparkles / Highlights on Glass */}
            <path
              d="M 23 20 A 1 1 0 0 1 23 100"
              fill="none"
              stroke="rgba(255, 255, 255, 0.06)"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>

          {/* Central floating percentage */}
          <div style={{
            position: 'absolute',
            top: '55%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            pointerEvents: 'none'
          }}>
            <span style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 800,
              fontSize: '1.25rem',
              color: 'var(--text-white)',
              textShadow: '0 2px 10px rgba(0,0,0,0.6)'
            }}>
              {percent}%
            </span>
          </div>
        </div>

        {/* Info & Vault Transaction Portal */}
        <div style={{ flex: 1, minWidth: '180px', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          <div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent)' }}>{goal.name}</h4>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.25rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Accumulated:</span>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-white)' }}>
                {currency}{goal.saved.toLocaleString()}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.15rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Target Goal:</span>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-white)' }}>
                {currency}{goal.target.toLocaleString()}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
            <button className="btn btn-secondary" onClick={() => openFundsModal('withdraw')} style={{ flex: 1, padding: '0.45rem', fontSize: '0.8rem' }}>
              Withdraw
            </button>
            <button className="btn btn-primary" onClick={() => openFundsModal('add')} style={{ flex: 1, padding: '0.45rem', fontSize: '0.8rem' }}>
              Deposit
            </button>
          </div>
        </div>

      </div>

      {/* Styled inline animation for wave */}
      <style>{`
        @keyframes liquid-wave {
          0% { transform: translateX(0); }
          100% { transform: translateX(-80px); }
        }
      `}</style>

      {/* Vault Transaction Deposit/Withdraw Modal */}
      {showAddFunds && (
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
          animation: 'fade-in 0.2s ease'
        }}>
          <form onSubmit={handleFundsSubmit} style={{ width: '100%', maxWidth: '300px' }}>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', textAlign: 'center' }}>
              {fundsAction === 'add' ? 'Vault Deposit' : 'Vault Withdrawal'}
            </h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '1.25rem' }}>
              Target: <span style={{ color: 'var(--accent)' }}>{goal.name}</span>
            </p>

            <div className="input-group">
              <input
                type="number"
                step="0.01"
                className="form-input"
                placeholder={`Enter amount (${currency})`}
                value={fundsAmount}
                onChange={(e) => setFundsAmount(e.target.value)}
                autoFocus
                required
              />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button type="button" className="btn btn-secondary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }} onClick={() => setShowAddFunds(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}>
                Confirm
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Target Edit Goal Modal */}
      {showEditGoal && (
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
          animation: 'fade-in 0.2s ease'
        }}>
          <form onSubmit={handleEditSubmit} style={{ width: '100%', maxWidth: '300px' }}>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '1.25rem', textAlign: 'center' }}>
              Configure Goal Benchmark
            </h4>

            <div className="input-group">
              <label htmlFor="edit-name-input" className="input-label">Goal Target Name</label>
              <input
                id="edit-name-input"
                type="text"
                className="form-input"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="edit-target-input" className="input-label">Financial Target ({currency})</label>
              <input
                id="edit-target-input"
                type="number"
                step="0.01"
                className="form-input"
                value={editTarget}
                onChange={(e) => setEditTarget(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginTop: '1.5rem' }}>
              <button type="button" className="btn btn-secondary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }} onClick={() => setShowEditGoal(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}>
                Save Configurations
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
