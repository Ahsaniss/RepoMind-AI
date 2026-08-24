/**
 * Context Builder Service
 *
 * Selects up to 5 relevant demo-repo files based on keyword matching
 * between the user question and file paths/content.
 * This keeps the Gemini prompt focused and avoids sending the whole repo.
 */

// ---------------------------------------------------------------------------
// Demo repository file data (inlined here for server‑side use)
// ---------------------------------------------------------------------------
export interface DemoFile {
  path: string;
  language: string;
  content: string;
}

export const DEMO_FILES: DemoFile[] = [
  {
    path: 'src/config.ts',
    language: 'typescript',
    content: `// Application configuration
export const config = {
  port: process.env.PORT || 3000,
  // WARNING: hardcoded secret — should come from env
  jwtSecret: 'super-secret-key-do-not-commit',
  dbUrl: process.env.DATABASE_URL || 'postgres://localhost:5432/app',
  apiKey: 'AKIAIOSFODNN7EXAMPLE', // TODO: move to .env
};
`,
  },
  {
    path: 'src/routes/auth.ts',
    language: 'typescript',
    content: `import { Router } from 'express';
import { db } from '../db';
import jwt from 'jsonwebtoken';
import { config } from '../config';

const router = Router();

// POST /auth/login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  // BUG: no input validation — SQL injection possible
  const user = await db.query(
    \`SELECT * FROM users WHERE username = '\${username}' AND password = '\${password}'\`
  );
  if (!user.rows.length) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const token = jwt.sign({ userId: user.rows[0].id }, config.jwtSecret, { expiresIn: '7d' });
  res.json({ token });
});

// POST /auth/register
router.post('/register', async (req, res) => {
  const { username, password, email } = req.body;
  // Missing: password hashing, email validation, duplicate check
  await db.query('INSERT INTO users (username, password, email) VALUES ($1, $2, $3)', [username, password, email]);
  res.json({ success: true });
});

export default router;
`,
  },
  {
    path: 'src/services/userService.ts',
    language: 'typescript',
    content: `import { db } from '../db';

export async function getAllUsers() {
  const users = await db.query('SELECT * FROM users');
  // N+1 query: fetches each user's posts separately
  for (const user of users.rows) {
    const posts = await db.query('SELECT * FROM posts WHERE user_id = $1', [user.id]);
    user.posts = posts.rows;
  }
  return users.rows;
}

export async function getUserById(id: string) {
  const result = await db.query('SELECT * FROM users WHERE id = $1', [id]);
  return result.rows[0];
}
`,
  },
  {
    path: 'src/middleware/auth.ts',
    language: 'typescript',
    content: `import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  try {
    const payload = jwt.verify(token, config.jwtSecret) as { userId: string };
    (req as any).userId = payload.userId;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}
`,
  },
  {
    path: 'src/db/index.ts',
    language: 'typescript',
    content: `import { Pool } from 'pg';
import { config } from '../config';

export const db = new Pool({ connectionString: config.dbUrl });

// No connection error handling — pool errors will be unhandled rejections
`,
  },
  {
    path: 'src/app.ts',
    language: 'typescript',
    content: `import express from 'express';
import authRouter from './routes/auth';
import { requireAuth } from './middleware/auth';

const app = express();
app.use(express.json());

// Public routes
app.use('/auth', authRouter);

// Protected routes (placeholder)
app.get('/me', requireAuth, (req, res) => {
  res.json({ userId: (req as any).userId });
});

export default app;
`,
  },
  {
    path: 'src/index.ts',
    language: 'typescript',
    content: `import app from './app';
import { config } from './config';

app.listen(config.port, () => {
  console.log(\`Server running on port \${config.port}\`);
});
`,
  },
  {
    path: 'package.json',
    language: 'json',
    content: `{
  "name": "repomind-demo",
  "version": "1.0.0",
  "dependencies": {
    "express": "^4.18.0",
    "jsonwebtoken": "^9.0.0",
    "pg": "^8.11.0",
    "lodash": "^4.17.21"
  },
  "devDependencies": {
    "@types/express": "^4.17.0",
    "@types/jsonwebtoken": "^9.0.0",
    "typescript": "^5.0.0"
  }
}
`,
  },
  {
    path: 'README.md',
    language: 'markdown',
    content: `# repomind-demo

A sample full-stack TypeScript project for demonstrating RepoMind AI.

## Architecture

- **src/app.ts** — Express app setup and routing
- **src/index.ts** — Server entry point
- **src/config.ts** — Application configuration (env vars)
- **src/routes/auth.ts** — Authentication endpoints (login, register)
- **src/middleware/auth.ts** — JWT authentication middleware
- **src/services/userService.ts** — User-related business logic
- **src/db/index.ts** — PostgreSQL connection pool

## Running

\`\`\`bash
npm install
npm run dev
\`\`\`
`,
  },
];

// ---------------------------------------------------------------------------
// Keyword extraction helpers
// ---------------------------------------------------------------------------
const KEYWORD_MAP: Record<string, string[]> = {
  auth: ['auth', 'login', 'logout', 'token', 'jwt', 'session', 'password', 'register', 'credential'],
  security: ['security', 'vulnerability', 'injection', 'xss', 'csrf', 'secret', 'key', 'env', 'safe', 'risk'],
  bug: ['bug', 'error', 'issue', 'problem', 'crash', 'fail', 'broken', 'fix'],
  performance: ['performance', 'slow', 'n+1', 'query', 'database', 'db', 'optimize', 'cache'],
  architecture: ['architecture', 'structure', 'design', 'pattern', 'module', 'overview', 'explain'],
  test: ['test', 'spec', 'unit', 'integration', 'coverage', 'jest', 'testing'],
  refactor: ['refactor', 'clean', 'improve', 'rewrite', 'simplify', 'duplicate'],
  config: ['config', 'env', 'environment', 'setting', 'variable'],
  database: ['database', 'db', 'sql', 'query', 'postgres', 'pool'],
  user: ['user', 'profile', 'account', 'service'],
};

function extractKeywords(question: string): string[] {
  const lower = question.toLowerCase();
  const found = new Set<string>();

  // Add raw words from the question
  lower.split(/\W+/).filter(w => w.length > 2).forEach(w => found.add(w));

  // Add semantic keywords from map
  for (const [_category, words] of Object.entries(KEYWORD_MAP)) {
    if (words.some(w => lower.includes(w))) {
      words.forEach(w => found.add(w));
    }
  }

  return Array.from(found);
}

function scoreFile(file: DemoFile, keywords: string[]): number {
  const haystack = (file.path + ' ' + file.content).toLowerCase();
  return keywords.reduce((score, kw) => {
    const matches = (haystack.match(new RegExp(kw, 'g')) || []).length;
    return score + matches;
  }, 0);
}

/**
 * Select up to `limit` (default 5) files most relevant to the given question.
 */
export function selectRelevantFiles(question: string, limit = 5): DemoFile[] {
  const keywords = extractKeywords(question);

  const scored = DEMO_FILES.map(file => ({
    file,
    score: scoreFile(file, keywords),
  }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  // If no matches, return the first `limit` files as fallback
  if (scored.length === 0) {
    return DEMO_FILES.slice(0, limit);
  }

  return scored.map(({ file }) => file);
}
