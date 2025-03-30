import express from 'express';
import cors from 'cors';
import client from './db.js';

const app = express();
const PORT = 3000;

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));
app.use(express.json());

app.get('/users', async (req, res) => {
    try {
        const result = await client.query('SELECT * FROM users');
        console.log(result.rows); 
        res.json(result.rows); 
    } catch (err) {
        console.error('Query failed:', err.stack);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/tasks', async (req, res) => {
    const { title, completed } = req.body;
    try {
        const result = await client.query(
            'INSERT INTO tasks (title, completed) VALUES ($1, $2) RETURNING *',
            [title, completed]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Insert failed:', err.stack);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});