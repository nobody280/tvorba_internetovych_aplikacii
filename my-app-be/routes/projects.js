import express from 'express';
import client from '../db.js';

const router = express.Router();

router.get('/', async (req, res) => {
    const projectid = req.query.project;

    if (!projectid) {
        return res.status(400).json({ error: 'ProjectId is required' });
    }
    const result = await client.query('SELECT t.id, t.decription, t.deadline, pm.user_id, t.project, pm.admin, t.state, p.project_priority, p.name FROM tasks t JOIN projectmember pm ON pm.task_id=t.id JOIN projects p ON t.project=p.id WHERE t.project = $1 ORDER BY t.deadline ASC;', [projectid]);
    res.json(result.rows);
})

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
            res.status(201).json({ message: 'Project created' });
        };

    } catch (error) {
        console.error(error);
        setError(error);
    };
});

router.delete('/:id', async (req, res) => {
    const projectid = req.params.id;

    try {
        await client.query('DELETE FROM tasks WHERE project = $1;', [projectid]);
        await client.query('DELETE FROM projectmember WHERE project_id = $1;', [projectid]);
        await client.query('DELETE FROM projects WHERE id = $1;', [projectid]);
        console.log("deleted :)");
        res.status({ message: 'Project deleted' });
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ error: 'Failed to delete task' });
    }
});  
export default router;
