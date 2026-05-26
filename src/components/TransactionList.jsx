import React, { useState, useMemo } from 'react';

// Custom SVG category icons
const CATEGORY_ICONS = {
  Salary: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  ),
  Investment: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 6l-9.5 9.5-5-5L1 18" />
      <path d="M17 6h6v6" />
    </svg>
  ),
  Food: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      <circle cx="12" cy="12" r="10" stroke="none" fill="currentColor" opacity="0.15" />
      <path d="M12 12m-9 0a9 9 0 1 0 18 0 9 9 0 1 0 -18 0" />
    </svg>
  ),
  Utilities: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  ),
  Entertainment: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
      <line x1="7" y1="2" x2="7" y2="22" />
      <line x1="17" y1="2" x2="17" y2="22" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <line x1="2" y1="7" x2="7" y2="7" />
      <line x1="2" y1="17" x2="7" y2="17" />
      <line x1="17" y1="17" x2="22" y2="17" />
      <line x1="17" y1="7" x2="22" y2="7" />
    </svg>
  ),
  Travel: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.8 19.2L16 11l3.5-3.5c.8-.8.8-2 0-2.8s-2-.8-2.8 0L13 8.2l-8-1.8c-.7-.1-1.4.3-1.6 1-.2.7.1 1.4.8 1.7l6.3 2.8-3.5 3.5-3-.5c-.4-.1-.8.1-1.1.4l-.8.8c-.3.3-.3.8 0 1.1l2.5 2.5 2.5 2.5c.3.3.8.3 1.1 0l.8-.8c.3-.3.4-.7.4-1.1l-.5-3 3.5-3.5 2.8 6.3c.3.7 1 .9 1.7.8.7-.2 1.1-.9 1-1.6z" />
    </svg>
  ),
  Shopping: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  ),
  Health: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  ),
  Miscellaneous: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  )
};

export default function TransactionList({ transactions, onDelete, onEdit, currency }) {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc');

  // Derive unique categories from active transactions
  const availableCategories = useMemo(() => {
    const cats = new Set(transactions.map(t => t.category));
    return Array.from(cats);
  }, [transactions]);

  // Search, Filter, and Sort logic
  const processedTransactions = useMemo(() => {
    let result = [...transactions];

    // Search query
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(t => t.description.toLowerCase().includes(q));
    }

    // Type filter
    if (filterType !== 'all') {
      result = result.filter(t => t.type === filterType);
    }

    // Category filter
    if (filterCategory !== 'all') {
      result = result.filter(t => t.category === filterCategory);
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'date-desc') {
        return new Date(b.date) - new Date(a.date);
      }
      if (sortBy === 'date-asc') {
        return new Date(a.date) - new Date(b.date);
      }
      if (sortBy === 'amount-desc') {
        return b.amount - a.amount;
      }
      if (sortBy === 'amount-asc') {
        return a.amount - b.amount;
      }
      return 0;
    });

    return result;
  }, [transactions, search, filterType, filterCategory, sortBy]);

  // CSV Export Utility
  const exportToCSV = () => {
    if (processedTransactions.length === 0) return;
    
    const headers = ['Description', 'Amount', 'Type', 'Category', 'Date'];
    const rows = processedTransactions.map(t => [
      `"${t.description.replace(/"/g, '""')}"`,
      t.amount,
      t.type,
      t.category,
      t.date
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `expenses_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // JSON Export Utility
  const exportToJSON = () => {
    if (processedTransactions.length === 0) return;

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(processedTransactions, null, 2));
    const link = document.createElement("a");
    link.setAttribute("href", dataStr);
    link.setAttribute("download", `expenses_report_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="glass-card widget-full" style={{ display: 'flex', flexDirection: 'column' }}>
      
      {/* Title & Exports Panel */}
      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Transaction Ledger</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Search and review your transaction logs</p>
        </div>
        {transactions.length > 0 && (
          <div style={{ display: 'flex', gap: '0.65rem' }}>
            <button className="btn btn-secondary" onClick={exportToCSV} style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '0.25rem' }}>
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
              </svg>
              Export CSV
            </button>
            <button className="btn btn-secondary" onClick={exportToJSON} style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
              Export JSON
            </button>
          </div>
        )}
      </div>

      {/* Control Filter Bar */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '1rem',
        marginBottom: '1.5rem',
        paddingBottom: '1rem',
        borderBottom: '1px solid var(--border-light)'
      }}>
        {/* Search */}
        <div>
          <label htmlFor="search-input" className="input-label">Search Description</label>
          <input
            id="search-input"
            type="text"
            className="form-input"
            placeholder="Search keywords..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Filter Type */}
        <div>
          <label htmlFor="type-filter" className="input-label">Type</label>
          <select
            id="type-filter"
            className="form-select"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all" style={{ background: 'var(--bg-deep)' }}>All Types</option>
            <option value="income" style={{ background: 'var(--bg-deep)' }}>Income</option>
            <option value="expense" style={{ background: 'var(--bg-deep)' }}>Expense</option>
          </select>
        </div>

        {/* Filter Category */}
        <div>
          <label htmlFor="category-filter" className="input-label">Category</label>
          <select
            id="category-filter"
            className="form-select"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="all" style={{ background: 'var(--bg-deep)' }}>All Categories</option>
            {availableCategories.map(cat => (
              <option key={cat} value={cat} style={{ background: 'var(--bg-deep)' }}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Sort By */}
        <div>
          <label htmlFor="sort-select" className="input-label">Sort By</label>
          <select
            id="sort-select"
            className="form-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="date-desc" style={{ background: 'var(--bg-deep)' }}>Date (Newest)</option>
            <option value="date-asc" style={{ background: 'var(--bg-deep)' }}>Date (Oldest)</option>
            <option value="amount-desc" style={{ background: 'var(--bg-deep)' }}>Amount (Highest)</option>
            <option value="amount-asc" style={{ background: 'var(--bg-deep)' }}>Amount (Lowest)</option>
          </select>
        </div>
      </div>

      {/* Ledger Entries */}
      <div style={{ maxHeight: '420px', overflowY: 'auto', paddingRight: '0.25rem' }}>
        {processedTransactions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ opacity: 0.3, marginBottom: '0.75rem' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p style={{ fontSize: '0.95rem' }}>No matching records found.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {processedTransactions.map((t) => {
              const formattedDate = new Date(t.date).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              });

              return (
                <div
                  key={t.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.9rem 1.25rem',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.04)',
                    borderRadius: '14px',
                    transition: 'var(--transition)'
                  }}
                  className="ledger-item"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {/* Glowing circular category icon */}
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      background: t.type === 'income' ? 'var(--success-glow)' : 'var(--danger-glow)',
                      color: t.type === 'income' ? 'var(--success)' : 'var(--danger)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: `0 0 10px ${t.type === 'income' ? 'var(--success-glow)' : 'var(--danger-glow)'}`
                    }}>
                      {CATEGORY_ICONS[t.category] || CATEGORY_ICONS.Miscellaneous}
                    </div>

                    <div>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-white)' }}>
                        {t.description}
                      </h4>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.2rem' }}>
                        <span style={{
                          fontSize: '0.75rem',
                          background: 'rgba(255, 255, 255, 0.06)',
                          padding: '0.1rem 0.4rem',
                          borderRadius: '4px',
                          color: 'var(--text-muted)'
                        }}>
                          {t.category}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {formattedDate}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                    <span style={{
                      fontFamily: 'var(--font-heading)',
                      fontWeight: 700,
                      fontSize: '1.05rem',
                      color: t.type === 'income' ? 'var(--success)' : 'var(--danger)'
                    }}>
                      {t.type === 'income' ? '+' : '-'}{currency}{t.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>

                    {/* Action buttons */}
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      {/* Edit Button */}
                      <button
                        onClick={() => onEdit(t)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--text-muted)',
                          cursor: 'pointer',
                          padding: '0.35rem',
                          borderRadius: '8px',
                          transition: 'var(--transition)'
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'none'; }}
                        aria-label="Edit transaction"
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => onDelete(t.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--text-muted)',
                          cursor: 'pointer',
                          padding: '0.35rem',
                          borderRadius: '8px',
                          transition: 'var(--transition)'
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--danger)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'none'; }}
                        aria-label="Delete transaction"
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
