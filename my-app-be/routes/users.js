import express from 'express';
import bcrypt from 'bcryptjs';
import client from '../db.js';

const router = express.Router();

router.post('/register', async (req, res)  => {
  const { username, first_name, last_name, password } = req.body;

  try {
    const user = await client.query('INSERT INTO users (first_name, last_name, username) VALUES ($1, $2, $3) RETURNING *;', [first_name, last_name, username]);
    const userId = user.rows[0]?.id;

    console.log(userId);

    const hash = await bcrypt.hash(password, 10);
    const account = await client.query('INSERT INTO accounts (password_hash, user_id) VALUES ($1, $2) RETURNING *;', [hash, userId]);

    res.status(200).json({ message: 'Registration successful', userId, userName: username });
  } catch (err) {
    console.error('Error during registration:', err);
    res.status(500).json({ error: 'Internal Server Error' }); 
  }
});

router.post('/login', async (req, res)  => {
  const { username, password } = req.body;

  try {
    const result = await client.query('SELECT * FROM accounts JOIN users ON accounts.user_id=users.id WHERE users.username = $1;', [username]);
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