import pg from 'pg';
const { Client } = pg;

const client = new Client({
    host: 'localhost', 
    user: 'postgres', 
    password: 'mfd8amb8fu',
    database: 'my_app', 
    port: 5432 
});

client.connect()
    .then(() => console.log('Connected to the PostgreSQL database'))
    .catch(err => console.error('Database connection failed:', err.stack));

client.query('SELECT * FROM tasks')
    .then(res => {
        console.log('Data:', res.rows); 
    })
    .catch(err => {
        console.error('Query failed:', err.stack);
    });
