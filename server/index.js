import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import apiRouter from './routes/api.js';
import './db.js'; // Initialize database connection

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api', apiRouter);

app.get('/', (req, res) => {
  res.json({ message: 'AI Study Buddy API is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

