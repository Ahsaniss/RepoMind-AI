import path from 'path';
import dotenv from 'dotenv';
// Load .env from the project root (two levels up from server/src)
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
import express from 'express';
import cors from 'cors';
import { aiRouter } from './routes/ai';
import { githubRouter } from './routes/github';
import { repositoriesRouter } from './routes/repositories';



const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

// Routes
app.use('/api/ai', aiRouter);
app.use('/api/github', githubRouter);
app.use('/api/repositories', repositoriesRouter);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`\n  🧠 RepoMind AI server running at http://localhost:${PORT}\n`);
});

export default app;
