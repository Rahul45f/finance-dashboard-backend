const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { users, uuidv4 } = require('../data/store');
const { authenticate } = require('../middleware/auth');
const { requireRole } = require('../middleware/roleGuard');

// GET /api/users — admin only
router.get('/', authenticate, requireRole('admin'), (req, res) => {
  const safe = users.map(({ password, ...u }) => u);
  res.json(safe);
});

// GET /api/users/:id — admin only
router.get('/:id', authenticate, requireRole('admin'), (req, res) => {
  const user = users.find((u) => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const { password, ...safe } = user;
  res.json(safe);
});

// POST /api/users — admin only
router.post('/', authenticate, requireRole('admin'), (req, res) => {
  const { name, username, email, password, role } = req.body;

  if (!name || !username || !email || !password || !role) {
    return res.status(400).json({
      error: 'name, username, email, password, and role are required'
    });
  }

  if (!['admin', 'analyst', 'viewer'].includes(role)) {
    return res.status(400).json({
      error: 'role must be admin, analyst, or viewer'
    });
  }

  if (users.find((u) => u.username === username || u.email === email)) {
    return res.status(409).json({ error: 'username or email already exists' });
  }

  const newUser = {
    id: uuidv4(),
    name,
    username,
    email,
    password: bcrypt.hashSync(password, 8),
    role,
    status: 'active'
  };

  users.push(newUser);
  const { password: _, ...safe } = newUser;
  res.status(201).json(safe);
});

// PUT /api/users/:id — admin only
router.put('/:id', authenticate, requireRole('admin'), (req, res) => {
  const idx = users.findIndex((u) => u.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'User not found' });

  const { name, email, role, status } = req.body;

  if (role && !['admin', 'analyst', 'viewer'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role' });
  }

  if (status && !['active', 'inactive'].includes(status)) {
    return res.status(400).json({ error: 'status must be active or inactive' });
  }

  if (name) users[idx].name = name;
  if (email) users[idx].email = email;
  if (role) users[idx].role = role;
  if (status) users[idx].status = status;

  const { password, ...safe } = users[idx];
  res.json(safe);
});

// DELETE /api/users/:id — admin only
router.delete('/:id', authenticate, requireRole('admin'), (req, res) => {
  const idx = users.findIndex((u) => u.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'User not found' });

  users.splice(idx, 1);
  res.json({ message: 'User deleted' });
});

module.exports = router;
