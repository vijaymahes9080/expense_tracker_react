import React, { useState, useEffect } from 'react';

const EXPENSE_CATEGORIES = ['Food', 'Utilities', 'Entertainment', 'Travel', 'Shopping', 'Health', 'Miscellaneous'];
const INCOME_CATEGORIES = ['Salary', 'Investment', 'Miscellaneous'];

export default function TransactionForm({ isOpen, onClose, onSubmit, editTransaction, currency }) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [errors, setErrors] = useState({});

  // Sync state if editing a transaction
  useEffect(() => {
    if (editTransaction) {
      setDescription(editTransaction.description);
      setAmount(editTransaction.amount.toString());
      setType(editTransaction.type);
      setCategory(editTransaction.category);
      setDate(editTransaction.date);
    } else {
      // Default clean values for new transaction
      setDescription('');
      setAmount('');
      setType('expense');
      setCategory(EXPENSE_CATEGORIES[0]);
      setDate(new Date().toISOString().split('T')[0]);
    }
    setErrors({});
  }, [editTransaction, isOpen]);

  // Adjust default category when type toggles
  useEffect(() => {
    if (!editTransaction) {
      if (type === 'expense') {
        setCategory(EXPENSE_CATEGORIES[0]);
      } else {
        setCategory(INCOME_CATEGORIES[0]);
      }
    }
  }, [type, editTransaction]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      newErrors.amount = 'Please enter a positive amount';
    }

    if (!date) {
      newErrors.date = 'Date is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit({
      id: editTransaction ? editTransaction.id : Date.now().toString(),
      description: description.trim(),
      amount: parsedAmount,
      type,
      category,
      date
    });

    onClose();
  };

  const currentCategories = type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>
            {editTransaction ? 'Edit Transaction' : 'Add Transaction'}
          </h2>
          <button onClick={onClose} style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            fontSize: '1.5rem',
            lineHeight: 1
          }} aria-label="Close dialog">
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Transaction Type Toggle */}
          <div className="input-group">
            <span className="input-label">Transaction Type</span>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.25rem' }}>
              <button
                type="button"
                className="btn"
                style={{
                  flex: 1,
                  background: type === 'expense' ? 'var(--danger-gradient)' : 'rgba(255, 255, 255, 0.04)',
                  border: type === 'expense' ? 'none' : '1px solid var(--border-light)',
                  color: 'var(--text-white)',
                  boxShadow: type === 'expense' ? '0 4px 15px var(--danger-glow)' : 'none',
                  padding: '0.65rem'
                }}
                onClick={() => setType('expense')}
              >
                Expense
              </button>
              <button
                type="button"
                className="btn"
                style={{
                  flex: 1,
                  background: type === 'income' ? 'var(--success-gradient)' : 'rgba(255, 255, 255, 0.04)',
                  border: type === 'income' ? 'none' : '1px solid var(--border-light)',
                  color: 'var(--text-white)',
                  boxShadow: type === 'income' ? '0 4px 15px var(--success-glow)' : 'none',
                  padding: '0.65rem'
                }}
                onClick={() => setType('income')}
              >
                Income
              </button>
            </div>
          </div>

          {/* Description */}
          <div className="input-group">
            <label htmlFor="description-input" className="input-label">Description</label>
            <input
              id="description-input"
              type="text"
              className="form-input"
              placeholder="e.g. Grocery Shop, Salary Payout"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ borderColor: errors.description ? 'var(--danger)' : 'var(--border-light)' }}
            />
            {errors.description && (
              <span style={{ fontSize: '0.75rem', color: 'var(--danger)', marginTop: '0.25rem', display: 'block' }}>
                {errors.description}
              </span>
            )}
          </div>

          {/* Amount & Date Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {/* Amount */}
            <div className="input-group">
              <label htmlFor="amount-input" className="input-label">Amount ({currency})</label>
              <input
                id="amount-input"
                type="number"
                step="0.01"
                className="form-input"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                style={{ borderColor: errors.amount ? 'var(--danger)' : 'var(--border-light)' }}
              />
              {errors.amount && (
                <span style={{ fontSize: '0.75rem', color: 'var(--danger)', marginTop: '0.25rem', display: 'block' }}>
                  {errors.amount}
                </span>
              )}
            </div>

            {/* Date */}
            <div className="input-group">
              <label htmlFor="date-input" className="input-label">Date</label>
              <input
                id="date-input"
                type="date"
                className="form-input"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                style={{ borderColor: errors.date ? 'var(--danger)' : 'var(--border-light)' }}
              />
              {errors.date && (
                <span style={{ fontSize: '0.75rem', color: 'var(--danger)', marginTop: '0.25rem', display: 'block' }}>
                  {errors.date}
                </span>
              )}
            </div>
          </div>

          {/* Category */}
          <div className="input-group">
            <label htmlFor="category-select" className="input-label">Category</label>
            <select
              id="category-select"
              className="form-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {currentCategories.map((cat) => (
                <option key={cat} value={cat} style={{ background: 'var(--bg-deep)', color: 'var(--text-primary)' }}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '2rem', justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editTransaction ? 'Save Changes' : 'Add Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
