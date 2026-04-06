const express = require('express');
const router = express.Router();
const { records } = require('../data/store');
const { authenticate } = require('../middleware/auth');
const { requireRole } = require('../middleware/roleGuard');

const allRoles = ['viewer', 'analyst', 'admin'];

// GET /api/dashboard/summary
router.get('/summary', authenticate, requireRole(...allRoles), (req, res) => {
  const totalIncome   = records.filter(r => r.type === 'income').reduce((s, r) => s + r.amount, 0);
  const totalExpenses = records.filter(r => r.type === 'expense').reduce((s, r) => s + r.amount, 0);
  res.json({ totalIncome, totalExpenses, netBalance: totalIncome - totalExpenses, totalRecords: records.length });
});

// GET /api/dashboard/categories
router.get('/categories', authenticate, requireRole(...allRoles), (req, res) => {
  const byCategory = {};
  records.forEach(r => {
    if (!byCategory[r.category]) byCategory[r.category] = { income: 0, expense: 0 };
    byCategory[r.category][r.type] += r.amount;
  });
  res.json(byCategory);
});

// GET /api/dashboard/trends — monthly breakdown
router.get('/trends', authenticate, requireRole(...allRoles), (req, res) => {
  const trends = {};
  records.forEach(r => {
    const month = r.date.slice(0, 7); // YYYY-MM
    if (!trends[month]) trends[month] = { income: 0, expense: 0 };
    trends[month][r.type] += r.amount;
  });
  const result = Object.entries(trends)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, data]) => ({ month, ...data, net: data.income - data.expense }));
  res.json(result);
});

// GET /api/dashboard/latest — last 10 records
router.get('/latest', authenticate, requireRole(...allRoles), (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const latest = [...records].sort((a, b) => b.date.localeCompare(a.date)).slice(0, limit);
  res.json(latest);
});

module.exports = router;
