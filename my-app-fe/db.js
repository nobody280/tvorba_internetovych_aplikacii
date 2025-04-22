import { Client } from 'pg';

require('dotenv').config();

const client = new Client({
  connectionString: process.env.DB_URL, 
});

client.connect()
  .then(() => console.log('Connected to PostgreSQL database'))
  .catch(err => console.error('Connection error', err.stack));

export default client;