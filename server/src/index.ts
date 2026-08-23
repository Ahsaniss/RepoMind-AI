import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import { aiRouter } from './routes/ai';
import { githubRouter } from './routes/github';
import { repositoriesRouter } from './routes/repositories';



const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api/ai', aiRouter);
app.use('/api/github', githubRouter);
app.use('/api/repositories', repositoriesRouter);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n  🧠 RepoMind AI server running at http://localhost:${PORT}\n`);
});

export default app;
