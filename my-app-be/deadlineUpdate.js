import cron from 'node-cron';
import client from './db.js';

async function updateStates() {
  try {
    console.log('Connected to the database');

    console.log('Running daily task status update...');
    await client.query(`
      UPDATE tasks
      SET state = 'overdue'
      WHERE state != 'finished' AND deadline < CURRENT_DATE
    `);
    console.log('Task statuses updated.');

    await client.query(`
      UPDATE projects
      SET state = 'overdue'
      WHERE state != 'finished' AND final_deadline < CURRENT_DATE
    `);
    console.log('Project statuses updated.');
  } catch (err) {
    console.error('Error updating task statuses:', err);
  } 
}

cron.schedule('0 0 * * *', updateStates);

export { updateStates };