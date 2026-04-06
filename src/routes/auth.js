const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { users, uuidv4 } = require('../data/store');
const { SECRET } = require('../middleware/auth');

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'username and password required' });

  const user = users.find(u => u.username === username);
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  if (user.status !== 'active') return res.status(403).json({ error: 'Account is inactive' });

  const token = jwt.sign({ id: user.id, role: user.role }, SECRET, { expiresIn: '8h' });
  res.json({ token, user: { id: user.id, name: user.name, role: user.role, email: user.email } });
});

// POST /api/auth/register (admin creates users; public registration disabled)
router.post('/register', (req, res) => {
  res.status(403).json({ error: 'Self-registration disabled. Ask admin to create your account via POST /api/users' });
});

module.exports = router;
