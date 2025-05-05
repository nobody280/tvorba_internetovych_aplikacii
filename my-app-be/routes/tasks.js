import express from 'express';
import client from '../db.js';

const router = express.Router();


router.get('/', async (req, res) => {
  try {
    const id = req.query.id;
    if (!id) {
      return res.status(400).json({ error: 'User is required' });
    }
    const result = await client.query('SELECT * FROM tasks t JOIN projectmember pm ON pm.task_id=t.id WHERE pm.user_id = $1;', [id]);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/', async (req, res) => {
  const { userid, task, date, state, priority } = req.body;

  if (!task || !date) {
    return res.status(400).json({ error: 'Name and Deadline are required' });
  }

  try {
    const project = await client.query('INSERT INTO projects (name, state, final_deadline, project_priority) VALUES ($1, $2, $3, $4) RETURNING *;', [task, state, date, priority]);
    const projectId = project.rows[0].id;
    const taskResult = await client.query('INSERT INTO tasks (decription, state, deadline, project) VALUES ($1, $2, $3, $4) RETURNING *;', [task, state, date, projectId]);
    const taskId = taskResult.rows[0].id;
    const projectmember = await client.query('INSERT INTO projectmember (user_id, admin, project_id, task_id) VALUES ($1, $2, $3, $4) RETURNING *;', [userid, true, projectId, taskId]);

    const newTask = taskResult.rows[0];
    res.status(201).json(newTask);
  } catch (error) {
    console.error('Error inserting task:', error);
    res.status(500).json({ error: 'Error inserting task' });
  }
});

router.put('/', async (req,res) => {
  const { taskid, decription, priority, state, date } = req.body;
  console.log(taskid);

  try {
    const taskResult = await client.query('SELECT * FROM tasks WHERE tasks.id = $1;', [taskid]);
    const updatedTask = await client.query('UPDATE tasks SET decription = $2, state = $3, deadline = $4 WHERE id = $1 RETURNING *;', [taskid, decription, state, date]);
    const projectid = updatedTask.rows[0].project;

    const updatedProject = await client.query('UPDATE projects SET name = $2, state = $3, final_deadline = $4, project_priority=$5 WHERE id = $1;', [projectid, decription, state, date, priority]);
    
    const newTask = taskResult.rows[0];
    res.status(201).json(newTask);
  } catch (error) {
    console.error('Error inserting task:', error);
    res.status(500).json({ error: 'Error inserting task' });
  }
  });

router.delete('/', async (req, res) => {
  const {taskId} = req.body;
  try {
    console.log(taskId);
    const task = await client.query('DELETE FROM tasks WHERE id = $1 RETURNING *;', [taskId]);
    const projectId = task.rows[0].project;
    await client.query('DELETE FROM projects WHERE id = $1;', [projectId]);
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

export default router;
