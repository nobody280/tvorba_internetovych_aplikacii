import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import session from 'express-session';
import dotenv from 'dotenv';

import usersRouter from './routes/users.js';
import tasksRouter from './routes/tasks.js';
import projectRouter from './routes/projects.js';
import { updateStates } from './deadlineUpdate.js';

import { fileURLToPath } from 'url';

dotenv.config();
var app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true }
  }));

  app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/users', usersRouter);
app.use('/api/tasks', tasksRouter);
app.use('/api/projects', projectRouter);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

updateStates();

export default app;
