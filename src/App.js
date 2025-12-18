import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('transactions');
    return saved ? JSON.parse(saved) : [];
  });

  const [text, setText] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = (e) => {
    e.preventDefault();
    if (!text || !amount) return;

    const newTransaction = {
      id: window.crypto.randomUUID() || Date.now().toString(), 
      text,
      amount: parseFloat(amount),
      category,
      type: parseFloat(amount) > 0 ? 'income' : 'expense'
    };

    setTransactions([newTransaction, ...transactions]);
    setText('');
    setAmount('');
  };

  const deleteTransaction = (id) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const totalBalance = transactions.reduce((acc, t) => acc + t.amount, 0).toFixed(2);
  const income = transactions.filter(t => t.amount > 0).reduce((acc, t) => acc + t.amount, 0).toFixed(2);
  const expense = Math.abs(transactions.filter(t => t.amount < 0).reduce((acc, t) => acc + t.amount, 0)).toFixed(2);

  return (
    <div className="container">
      <header>
        <h1>Expense Tracker</h1>
        <p className="subtitle">Manage your personal finances</p>
      </header>

      <div className="dashboard-grid">
        <div className="card balance-card">
          <span className="icon">💰</span>
          <div>
            <h3>Total Balance</h3>
            <h2>${totalBalance}</h2>
          </div>
        </div>
        <div className="card income-card">
          <span className="icon text-green">➕</span>
          <div>
            <h3>Total Income</h3>
            <h2 className="text-green">${income}</h2>
          </div>
        </div>
        <div className="card expense-card">
          <span className="icon text-red">➖</span>
          <div>
            <h3>Total Expenses</h3>
            <h2 className="text-red">${expense}</h2>
          </div>
        </div>
      </div>

      <div className="main-content">
        <div className="left-panel">
          <div className="card">
            <h3>New Transaction</h3>
            <form onSubmit={addTransaction}>
              <input 
                type="text" 
                placeholder="Description" 
                value={text} 
                onChange={(e) => setText(e.target.value)} 
                required
              />
              <input 
                type="number" 
                placeholder="Amount (negative for expense)" 
                value={amount} 
                onChange={(e) => setAmount(e.target.value)} 
                required
              />
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="Food">Food</option>
                <option value="Salary">Salary</option>
                <option value="Rent">Rent</option>
                <option value="Shopping">Shopping</option>
                <option value="Entertainment">Entertainment</option>
              </select>
              <button type="submit" className="btn-add">Add Transaction</button>
            </form>
          </div>
        </div>

        <div className="right-panel">
          <div className="card history-card">
            <h3>Transaction History</h3>
            <div className="list-scroll">
              {transactions.length === 0 ? (
                <p className="empty-msg">No transactions recorded.</p>
              ) : (
                transactions.map(t => (
                  <div key={t.id} className={`list-item ${t.type}`}>
                    <span>{t.text} <small>({t.category})</small></span>
                    <div className="item-right">
                      <span className={t.amount > 0 ? 'text-green' : 'text-red'}>
                        {t.amount > 0 ? '+' : ''}${t.amount}
                      </span>
                      <button className="delete-btn" onClick={() => deleteTransaction(t.id)}>❌</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
