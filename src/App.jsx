import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import ExpenseChart from './components/ExpenseChart';
import TransactionList from './components/TransactionList';
import TransactionForm from './components/TransactionForm';
import BudgetTracker from './components/BudgetTracker';
import SavingsGoal from './components/SavingsGoal';

// Premium Mock Starting Data
const INITIAL_TRANSACTIONS = [
  { id: 't1', description: 'Freelance Design Project', amount: 2450.00, type: 'income', category: 'Salary', date: '2026-05-18' },
  { id: 't2', description: 'Weekly Organic Groceries', amount: 184.20, type: 'expense', category: 'Food', date: '2026-05-20' },
  { id: 't3', description: 'Premium Fiber Internet', amount: 65.00, type: 'expense', category: 'Utilities', date: '2026-05-22' },
  { id: 't4', description: 'Acoustic Guitar Gear', amount: 350.00, type: 'expense', category: 'Shopping', date: '2026-05-23' },
  { id: 't5', description: 'Cinematic Concert Tickets', amount: 80.00, type: 'expense', category: 'Entertainment', date: '2026-05-24' },
  { id: 't6', description: 'Public Transit Pass', amount: 45.00, type: 'expense', category: 'Travel', date: '2026-05-25' },
  { id: 't7', description: 'Coffee at Roastery', amount: 12.50, type: 'expense', category: 'Food', date: '2026-05-26' }
];

const INITIAL_BUDGETS = {
  Food: 400,
  Utilities: 150,
  Entertainment: 200,
  Travel: 100,
  Shopping: 500
};

const INITIAL_GOAL = {
  name: 'New MacBook Pro',
  target: 2000,
  saved: 650
};

export default function App() {
  // Theme state
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('et-theme') || 'dark';
  });

  // Currency state
  const [currency, setCurrency] = useState(() => {
    return localStorage.getItem('et-currency') || '$';
  });

  // Core Data States
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('et-transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [budgets, setBudgets] = useState(() => {
    const saved = localStorage.getItem('et-budgets');
    return saved ? JSON.parse(saved) : INITIAL_BUDGETS;
  });

  const [savingsGoal, setSavingsGoal] = useState(() => {
    const saved = localStorage.getItem('et-goal');
    return saved ? JSON.parse(saved) : INITIAL_GOAL;
  });

  // Modal open states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editTransaction, setEditTransaction] = useState(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('et-transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('et-budgets', JSON.stringify(budgets));
  }, [budgets]);

  useEffect(() => {
    localStorage.setItem('et-goal', JSON.stringify(savingsGoal));
  }, [savingsGoal]);

  useEffect(() => {
    localStorage.setItem('et-currency', currency);
  }, [currency]);

  // Apply theme class
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('et-theme', theme);
  }, [theme]);

  // Add/Edit transaction submission handler
  const handleTransactionSubmit = (data) => {
    if (editTransaction) {
      // Modifying existing transaction
      setTransactions(prev => prev.map(t => t.id === data.id ? data : t));
      setEditTransaction(null);
    } else {
      // Adding new transaction
      setTransactions(prev => [data, ...prev]);
    }
  };

  // Delete handler
  const handleTransactionDelete = (id) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  // Edit trigger
  const handleTransactionEdit = (transaction) => {
    setEditTransaction(transaction);
    setIsFormOpen(true);
  };

  // Update category budget
  const handleUpdateBudget = (category, limit) => {
    setBudgets(prev => ({
      ...prev,
      [category]: limit
    }));
  };

  // Update savings goal + integrate transaction logs automatically
  const handleUpdateGoal = (newGoal, transactionDetails) => {
    setSavingsGoal(newGoal);

    // If an action (deposit/withdraw) occurred, log it into transactions
    if (transactionDetails) {
      const { action, amount, name } = transactionDetails;
      const isDeposit = action === 'add';

      const newLog = {
        id: Date.now().toString(),
        description: isDeposit ? `Vault Deposit: ${name}` : `Vault Withdrawal: ${name}`,
        amount: amount,
        type: isDeposit ? 'expense' : 'income',
        category: 'Investment',
        date: new Date().toISOString().split('T')[0]
      };

      setTransactions(prev => [newLog, ...prev]);
    }
  };

  // Toggle Theme helper
  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="app-container">
      {/* Background blobs for premium styling */}
      <div className="ambient-glows">
        <div className="glow-blob-1" />
        <div className="glow-blob-2" />
        <div className="glow-blob-3" />
      </div>

      {/* Glassmorphic Header */}
      <header className="glass-card" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1.25rem 2rem',
        marginBottom: '2rem',
        borderRadius: '24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Logo vector */}
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'var(--primary-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px var(--primary-glow)'
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
          </div>
          <div>
            <h1 style={{ fontSize: '1.35rem', fontWeight: 800, background: 'linear-gradient(90deg, #ffffff 0%, var(--text-muted) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: theme === 'dark' ? 'transparent' : 'inherit' }}>
              Apex Finance
            </h1>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Premium wealth management tracker</p>
          </div>
        </div>

        {/* Action Panel */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Currency selector option menu */}
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid var(--border-light)',
              borderRadius: '12px',
              color: 'var(--text-white)',
              padding: '0 0.75rem',
              height: '42px',
              cursor: 'pointer',
              fontFamily: 'var(--font-heading)',
              fontWeight: 600,
              outline: 'none',
              transition: 'var(--transition)'
            }}
          >
            <option value="$" style={{ background: 'var(--bg-deep)' }}>USD ($)</option>
            <option value="₹" style={{ background: 'var(--bg-deep)' }}>INR (₹)</option>
            <option value="€" style={{ background: 'var(--bg-deep)' }}>EUR (€)</option>
            <option value="£" style={{ background: 'var(--bg-deep)' }}>GBP (£)</option>
          </select>

          {/* Theme Switcher Toggle */}
          <button
            onClick={toggleTheme}
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid var(--border-light)',
              borderRadius: '12px',
              width: '42px',
              height: '42px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'var(--transition)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>

          {/* Quick Add Button */}
          <button className="btn btn-primary" onClick={() => { setEditTransaction(null); setIsFormOpen(true); }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Transaction
          </button>
        </div>
      </header>

      {/* Main summary grids */}
      <Dashboard transactions={transactions} currency={currency} />

      {/* High-fidelity Custom SVG Visualizations */}
      <ExpenseChart transactions={transactions} currency={currency} />

      {/* Grid for Budget Matrix & Savings Goals */}
      <div className="dashboard-grid" style={{ marginTop: '0rem', marginBottom: '2rem' }}>
        <BudgetTracker 
          transactions={transactions} 
          budgets={budgets} 
          onUpdateBudget={handleUpdateBudget} 
          currency={currency}
        />
        <SavingsGoal 
          goal={savingsGoal} 
          onUpdateGoal={handleUpdateGoal} 
          currency={currency}
        />
      </div>

      {/* Main ledger list */}
      <TransactionList 
        transactions={transactions} 
        onDelete={handleTransactionDelete} 
        onEdit={handleTransactionEdit} 
        currency={currency}
      />

      {/* Transaction Modal Portal */}
      <TransactionForm 
        isOpen={isFormOpen} 
        onClose={() => { setIsFormOpen(false); setEditTransaction(null); }} 
        onSubmit={handleTransactionSubmit} 
        editTransaction={editTransaction} 
        currency={currency}
      />
    </div>
  );
}
