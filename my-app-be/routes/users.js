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

router.post('/', async (req, res)  => {
  console.log('POST request received');
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Missing username or password' });
  }

  try {
    const names = username.split(' ');
    const result = await client.query('SELECT * FROM accounts JOIN users ON accounts.user_id=users.id WHERE users.first_name = $1 AND users.last_name = $2', names);
    const user = result.rows[0];

    console.log(user);
    if (!user) {
      return res.status(401).json({ message: 'Invalid username ' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    res.status(200).json({ message: 'Login successful', userId: user.id });

  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
