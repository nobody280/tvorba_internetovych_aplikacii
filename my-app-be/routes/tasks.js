import express from 'express';
import client from '../db.js';

const router = express.Router();


router.get('/', async (req, res) => {
  try {
    const names = req.query.username.split(' ');
    const result = await client.query('SELECT pm.task_id, t.decription, t.state, t.deadline, t.project, pm.admin FROM tasks t JOIN projectmember pm ON pm.task_id=t.id JOIN users u ON pm.user_id=u.id WHERE u.first_name = $1 AND u.last_name = $2;', names);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/', async (req, res) => {
  const { username, task, date, state } = req.body;
  const names = username.split(' ');

  if (!task || !date) {
    return res.status(400).json({ error: 'Name and Deadline are required' });
  }

  try {
    const userIdResult = await client.query("SELECT * FROM users WHERE first_name = $1 AND last_name = $2;", names);
    const userId = userIdResult.rows[0]?.id;
    if (!userId) {
      return res.status(404).json({ error: 'User not found' });
    }
    const project = await client.query('INSERT INTO projects (name, state, final_deadline) VALUES ($1, $2, $3) RETURNING *;', [task, state, date]);
    const projectId = project.rows[0].id;
    console.log(projectId);
    const taskResult = await client.query('INSERT INTO tasks (decription, state, deadline, project) VALUES ($1, $2, $3, $4) RETURNING *;', [task, state, date, projectId]);
    const taskId = taskResult.rows[0].id;
    const projectmember = await client.query('INSERT INTO projectmember (user_id, admin, project_id, task_id) VALUES ($1, $2, $3, $4) RETURNING *;', [userId, true, projectId, taskId]);

    const newTask = taskResult.rows[0];
    res.status(201).json(newTask);
  } catch (error) {
    console.error('Error inserting task:', error);
    res.status(500).json({ error: 'Error inserting task' });
  }
});

router.delete('/:id', async (req, res) => {
  const taskId = req.params.id;

  try {
    await client.query('DELETE FROM tasks WHERE task_id = $1', [taskId]);

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

export default router;
