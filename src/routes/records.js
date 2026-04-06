const express = require('express');
const router = express.Router();
const { records, uuidv4 } = require('../data/store');
const { authenticate } = require('../middleware/auth');
const { requireRole } = require('../middleware/roleGuard');

// GET /api/records — viewer, analyst, admin
router.get('/', authenticate, requireRole('viewer', 'analyst', 'admin'), (req, res) => {
  let result = [...records];
  const { type, category, from, to } = req.query;
  if (type)     result = result.filter(r => r.type === type);
  if (category) result = result.filter(r => r.category.toLowerCase() === category.toLowerCase());
  if (from)     result = result.filter(r => r.date >= from);
  if (to)       result = result.filter(r => r.date <= to);
  result.sort((a, b) => b.date.localeCompare(a.date));
  res.json(result);
});

// GET /api/records/:id — viewer, analyst, admin
router.get('/:id', authenticate, requireRole('viewer', 'analyst', 'admin'), (req, res) => {
  const record = records.find(r => r.id === req.params.id);
  if (!record) return res.status(404).json({ error: 'Record not found' });
  res.json(record);
});

// POST /api/records — analyst, admin
router.post('/', authenticate, requireRole('analyst', 'admin'), (req, res) => {
  const { amount, type, category, date, notes } = req.body;
  if (amount === undefined || !type || !category || !date) {
    return res.status(400).json({ error: 'amount, type, category, and date are required' });
  }
  if (typeof amount !== 'number' || amount <= 0) {
    return res.status(400).json({ error: 'amount must be a positive number' });
  }
  if (!['income', 'expense'].includes(type)) {
    return res.status(400).json({ error: 'type must be income or expense' });
  }
  if (isNaN(Date.parse(date))) {
    return res.status(400).json({ error: 'date is invalid' });
  }
  const newRecord = { id: uuidv4(), amount, type, category, date, notes: notes || '', createdBy: req.user.id };
  records.push(newRecord);
  res.status(201).json(newRecord);
});

// PUT /api/records/:id — analyst, admin
router.put('/:id', authenticate, requireRole('analyst', 'admin'), (req, res) => {
  const idx = records.findIndex(r => r.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Record not found' });
  const { amount, type, category, date, notes } = req.body;
  if (amount !== undefined) {
    if (typeof amount !== 'number' || amount <= 0) return res.status(400).json({ error: 'amount must be a positive number' });
    records[idx].amount = amount;
  }
  if (type) {
    if (!['income', 'expense'].includes(type)) return res.status(400).json({ error: 'type must be income or expense' });
    records[idx].type = type;
  }
  if (category) records[idx].category = category;
  if (date) {
    if (isNaN(Date.parse(date))) return res.status(400).json({ error: 'date is invalid' });
    records[idx].date = date;
  }
  if (notes !== undefined) records[idx].notes = notes;
  res.json(records[idx]);
});

// DELETE /api/records/:id — admin only
router.delete('/:id', authenticate, requireRole('admin'), (req, res) => {
  const idx = records.findIndex(r => r.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Record not found' });
  records.splice(idx, 1);
  res.json({ message: 'Record deleted' });
});

module.exports = router;
