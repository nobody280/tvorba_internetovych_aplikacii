import express from 'express';
import client from '../db.js';

const router = express.Router();


router.get('/', async (req, res) => {
  try {
    

    const result = await client.query('SELECT * FROM tasks t');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



export default router;
