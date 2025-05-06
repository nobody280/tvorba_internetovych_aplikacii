import pg from 'pg';
const { Client } = pg;

const client = new Client({
    host: 'localhost',
    user: 'postgres',
    password: 'mfd8amb8fu',
    database: 'my_app',
    port: 5432,
    ssl: false,
});

export default client;