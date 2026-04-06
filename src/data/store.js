const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

const users = [
  { id: '1', name: 'Admin User',    username: 'admin',   email: 'admin@example.com',   password: bcrypt.hashSync('admin123', 8),   role: 'admin',   status: 'active' },
  { id: '2', name: 'Analyst User',  username: 'analyst', email: 'analyst@example.com', password: bcrypt.hashSync('analyst123', 8), role: 'analyst', status: 'active' },
  { id: '3', name: 'Viewer User',   username: 'viewer',  email: 'viewer@example.com',  password: bcrypt.hashSync('viewer123', 8),  role: 'viewer',  status: 'active' },
];

const records = [
  { id: uuidv4(), amount: 50000, type: 'income',  category: 'Salary',     date: '2026-03-01', notes: 'March salary',       createdBy: '1' },
  { id: uuidv4(), amount: 12000, type: 'expense', category: 'Rent',       date: '2026-03-05', notes: 'Monthly rent',        createdBy: '1' },
  { id: uuidv4(), amount: 3000,  type: 'expense', category: 'Food',       date: '2026-03-10', notes: 'Groceries',           createdBy: '2' },
  { id: uuidv4(), amount: 8000,  type: 'income',  category: 'Freelance',  date: '2026-03-15', notes: 'Side project payment', createdBy: '2' },
  { id: uuidv4(), amount: 1500,  type: 'expense', category: 'Transport',  date: '2026-03-20', notes: 'Travel expenses',      createdBy: '1' },
];

module.exports = { users, records, uuidv4 };
