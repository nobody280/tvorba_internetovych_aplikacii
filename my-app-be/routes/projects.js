import express from 'express';
import client from '../db.js';

const router = express.Router();

router.get('/', (req, res) => {
    res.json({ message: 'Projects endpoint is up, but not implemented yet.' });
}); 

export default router;