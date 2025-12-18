import React, { useState, useEffect } from 'react';
import { PlusCircle, Trash2, Wallet, TrendingUp, TrendingDown } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { v4 as uuidv4 } from 'uuid';
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
      id: uuidv4(),
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
  const expense = (transactions.filter(t => t.amount < 0).reduce((acc, t) => acc + t.amount, 0) * -1).toFixed(2);

 
  const chartData = [
    { name: 'Income', value: parseFloat(income) },
    { name: 'Expense', value: parseFloat(expense) }
  ];
  const COLORS = ['#10b981', '#ef4444'];

  return (
    <div className="container">
      <header>
        <h1>Expense Tracker</h1>
        <p className="subtitle">Manage your personal finances</p>
      </header>

      <div className="dashboard-grid">
        <div className="card balance-card">
          <Wallet size={24} />
          <div>
            <h3>Total Balance</h3>
            <h2>${totalBalance}</h2>
          </div>
        </div>
        <div className="card income-card">
          <TrendingUp size={24} />
          <div>
            <h3>Total Income</h3>
            <h2 className="text-green">${income}</h2>
          </div>
        </div>
        <div className="card expense-card">
          <TrendingDown size={24} />
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
              <input type="text" placeholder="Description (e.g. Salary, Pizza)" value={text} onChange={(e) => setText(e.target.value)} />
              <input type="number" placeholder="Amount (- for expense, + for income)" value={amount} onChange={(e) => setAmount(e.target.value)} />
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="Food">Food</option>
                <option value="Salary">Salary</option>
                <option value="Rent">Rent</option>
                <option value="Entertainment">Entertainment</option>
              </select>
              <button type="submit" className="btn-add"><PlusCircle size={18} /> Add Transaction</button>
            </form>
          </div>

          <div className="card chart-card">
            <h3>Visual Summary</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={chartData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="right-panel">
          <div className="card history-card">
            <h3>Transaction History</h3>
            <div className="list-scroll">
              {transactions.map(t => (
                <div key={t.id} className={`list-item ${t.type}`}>
                  <span>{t.text} <small>({t.category})</small></span>
                  <div className="item-right">
                    <span>{t.amount > 0 ? '+' : ''}${t.amount}</span>
                    <button onClick={() => deleteTransaction(t.id)}><Trash2 size={16} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;