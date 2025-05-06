import express from 'express';
import client from '../db.js';

const router = express.Router();

router.get('/', (req, res) => {
    res.json({ message: 'Projects endpoint is up, but not implemented yet.' });
}); 

router.post('/', async (req, res) => {
    const { description, priority, findate, projectTasks} = req.body;
    const state = 'in progress';

    try {
        const project = await client.query('INSERT INTO projects (name, state, final_deadline, project_priority) VALUES ($1, $2, $3, $4) RETURNING *;', [description, state, findate, priority]);
        const projectId = project.rows[0].id;

        for (const t of projectTasks) {
            const task = await client.query('INSERT INTO tasks (decription, state, deadline, project) VALUES ($1, $2, $3, $4) RETURNING *;', [t.name, state, t.date, projectId]);
            const taskId = task.rows[0].id;

            const user = await client.query('SELECT * FROM users WHERE username = $1', [t.user]);
            const userid = user.rows[0].id;
            const projectmember = await client.query('INSERT INTO projectmember (user_id, admin, project_id, task_id) VALUES ($1, $2, $3, $4) RETURNING *;', [userid, t.admin, projectId, taskId]);

        };

    } catch (error) {
        console.error(error);
        setError(error);
    };
});

export default router;