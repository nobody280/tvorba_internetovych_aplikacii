import pg from 'pg';
const { Client } = pg;
require('dotenv').config();

const client = new Client({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,  
  port: 5432,  
  database: process.env.DB_DATABASE,
  ssl: {
    rejectUnauthorized: false, 
  }
});

client.connect()
  .then(() => console.log('Connected to PostgreSQL database'))
  .catch(err => console.error('Connection error', err.stack));

export default client;