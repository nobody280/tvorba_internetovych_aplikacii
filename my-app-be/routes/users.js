import express from 'express';
import bcrypt from 'bcryptjs';
import client from '../db.js';

const router = express.Router();


router.get('/', async (req, res) => {
  try {
    const result = await client.query('SELECT * FROM users');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/login', async (req, res)  => {
  const { username, password } = req.body;

  try {
    const names = username.split(' ');
    const result = await client.query('SELECT * FROM accounts JOIN users ON accounts.user_id=users.id WHERE users.first_name = $1 AND users.last_name = $2', names);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ message: 'Invalid username ' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    res.status(200).json({ message: 'Login successful', userId: user.id, userName: username });

  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.delete('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        console.error('Logout error:', err);
        return res.status(500).json({ error: 'Failed to log out' });
      }
      return res.status(200).json({ message: 'Logout successful' });
    });
  } else {
    res.status(400).json({ error: 'No session to log out' });
  }
});

export default router;