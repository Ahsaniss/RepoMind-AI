import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { demoRepositories } from '../data/demoRepository';
import ChatPanel from '../components/ai/ChatPanel';

// ─── Demo file tree ───────────────────────────────────────────────────────────
interface TreeNode {
  name: string;
  path: string;
  type: 'file' | 'dir';
  language?: string;
  children?: TreeNode[];
  content?: string;
}

const DEMO_TREE: TreeNode[] = [
  {
    name: 'src', path: 'src', type: 'dir', children: [
      { name: 'app.ts', path: 'src/app.ts', type: 'file', language: 'typescript', content: `import express from 'express';
import authRouter from './routes/auth';
import { requireAuth } from './middleware/auth';

const app = express();
app.use(express.json());

app.use('/auth', authRouter);

app.get('/me', requireAuth, (req, res) => {
  res.json({ userId: (req as any).userId });
});

export default app;` },
      { name: 'index.ts', path: 'src/index.ts', type: 'file', language: 'typescript', content: `import app from './app';
import { config } from './config';

app.listen(config.port, () => {
  console.log(\`Server running on port \${config.port}\`);
});` },
      { name: 'config.ts', path: 'src/config.ts', type: 'file', language: 'typescript', content: `export const config = {
  port: process.env.PORT || 3000,
  // WARNING: hardcoded secret
  jwtSecret: 'super-secret-key-do-not-commit',
  dbUrl: process.env.DATABASE_URL || 'postgres://localhost:5432/app',
  apiKey: 'AKIAIOSFODNN7EXAMPLE', // TODO: move to .env
};` },
      {
        name: 'routes', path: 'src/routes', type: 'dir', children: [
          { name: 'auth.ts', path: 'src/routes/auth.ts', type: 'file', language: 'typescript', content: `import { Router } from 'express';
import { db } from '../db';
import jwt from 'jsonwebtoken';
import { config } from '../config';

const router = Router();

// POST /auth/login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  // BUG: SQL injection vulnerability - no parameterized query
  const user = await db.query(
    \`SELECT * FROM users WHERE username = '\${username}' AND password = '\${password}'\`
  );
  if (!user.rows.length) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const token = jwt.sign({ userId: user.rows[0].id }, config.jwtSecret, { expiresIn: '7d' });
  res.json({ token });
});

router.post('/register', async (req, res) => {
  const { username, password, email } = req.body;
  await db.query('INSERT INTO users (username, password, email) VALUES ($1, $2, $3)', [username, password, email]);
  res.json({ success: true });
});

export default router;` }
        ]
      },
      {
        name: 'middleware', path: 'src/middleware', type: 'dir', children: [
          { name: 'auth.ts', path: 'src/middleware/auth.ts', type: 'file', language: 'typescript', content: `import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  try {
    const payload = jwt.verify(token, config.jwtSecret) as { userId: string };
    (req as any).userId = payload.userId;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}` }
        ]
      },
      {
        name: 'services', path: 'src/services', type: 'dir', children: [
          { name: 'userService.ts', path: 'src/services/userService.ts', type: 'file', language: 'typescript', content: `import { db } from '../db';

export async function getAllUsers() {
  const users = await db.query('SELECT * FROM users');
  // N+1 query problem
  for (const user of users.rows) {
    const posts = await db.query('SELECT * FROM posts WHERE user_id = $1', [user.id]);
    user.posts = posts.rows;
  }
  return users.rows;
}

export async function getUserById(id: string) {
  const result = await db.query('SELECT * FROM users WHERE id = $1', [id]);
  return result.rows[0];
}` }
        ]
      },
      {
        name: 'db', path: 'src/db', type: 'dir', children: [
          { name: 'index.ts', path: 'src/db/index.ts', type: 'file', language: 'typescript', content: `import { Pool } from 'pg';
import { config } from '../config';

export const db = new Pool({ connectionString: config.dbUrl });` }
        ]
      },
    ]
  },
  { name: 'package.json', path: 'package.json', type: 'file', language: 'json', content: `{
  "name": "repomind-demo",
  "version": "1.0.0",
  "dependencies": {
    "express": "^4.18.0",
    "jsonwebtoken": "^9.0.0",
    "pg": "^8.11.0",
    "lodash": "^4.17.21"
  }
}` },
  { name: 'README.md', path: 'README.md', type: 'file', language: 'markdown', content: `# repomind-demo

A sample full-stack TypeScript project for demonstrating RepoMind AI.

## Architecture
- **src/app.ts** — Express app setup
- **src/routes/auth.ts** — Auth endpoints
- **src/middleware/auth.ts** — JWT middleware
- **src/services/userService.ts** — Business logic
- **src/db/index.ts** — Database pool` },
];

// ─── FileTree component ────────────────────────────────────────────────────────
function FileTree({
  nodes,
  selectedPath,
  onSelect,
}: {
  nodes: TreeNode[];
  selectedPath: string;
  onSelect: (node: TreeNode) => void;
}) {
  const [open, setOpen] = useState<Record<string, boolean>>({ src: true });
  const toggle = (path: string) => setOpen(o => ({ ...o, [path]: !o[path] }));

  const renderNode = (node: TreeNode, depth = 0) => (
    <div key={node.path}>
      <button
        className={`filetree-item${node.path === selectedPath ? ' filetree-item--active' : ''}`}
        style={{ paddingLeft: `${0.75 + depth * 1}rem` }}
        onClick={() => node.type === 'dir' ? toggle(node.path) : onSelect(node)}
      >
        <span className="filetree-icon">
          {node.type === 'dir' ? (open[node.path] ? '▾' : '▸') : fileIcon(node.language)}
        </span>
        <span className="filetree-name">{node.name}</span>
        {node.language && <span className="filetree-lang">{node.language.slice(0, 2).toUpperCase()}</span>}
      </button>
      {node.type === 'dir' && open[node.path] && node.children?.map(c => renderNode(c, depth + 1))}
    </div>
  );

  return <div className="filetree">{nodes.map(n => renderNode(n))}</div>;
}

function fileIcon(lang?: string) {
  const map: Record<string, string> = { typescript: '🔷', json: '{}', markdown: '📝' };
  return lang ? (map[lang] || '📄') : '📄';
}

// ─── CodeViewer component ─────────────────────────────────────────────────────
function CodeViewer({
  file,
  scrollToLine,
}: {
  file: TreeNode | null;
  scrollToLine?: number;
}) {
  const lineRefs = useRef<Record<number, HTMLDivElement | null>>({});

  useEffect(() => {
    if (scrollToLine && lineRefs.current[scrollToLine]) {
      lineRefs.current[scrollToLine]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [scrollToLine, file]);

  if (!file) {
    return (
      <div className="codeviewer-empty">
        <span>📄</span>
        <p>Select a file from the tree to view its contents</p>
      </div>
    );
  }

  const lines = (file.content || '').split('\n');

  return (
    <div className="codeviewer">
      {/* Toolbar */}
      <div className="codeviewer-toolbar">
        <div className="codeviewer-path">
          <span className="codeviewer-path-icon">{fileIcon(file.language)}</span>
          <span>{file.path}</span>
        </div>
        <div className="codeviewer-toolbar-right">
          {file.language && <span className="codeviewer-lang-badge">{file.language}</span>}
          <button
            className="codeviewer-copy-btn"
            onClick={() => navigator.clipboard.writeText(file.content || '')}
            title="Copy file contents"
          >
            Copy
          </button>
        </div>
      </div>

      {/* Code */}
      <div className="codeviewer-body">
        <table className="codeviewer-table">
          <tbody>
            {lines.map((line, i) => {
              const lineNum = i + 1;
              const isHighlighted = scrollToLine === lineNum;
              return (
                <tr
                  key={lineNum}
                  className={`codeviewer-row${isHighlighted ? ' codeviewer-row--highlight' : ''}`}
                  ref={el => { lineRefs.current[lineNum] = el; }}
                >
                  <td className="codeviewer-lineno">{lineNum}</td>
                  <td className="codeviewer-code">
                    <pre>{line || ' '}</pre>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Main Repository Workspace ────────────────────────────────────────────────
export default function RepositoryPage() {
  const { id = 'demo-1' } = useParams();
  const navigate = useNavigate();
  const repo = demoRepositories.find(r => r.id === id) ?? demoRepositories[0];

  const [selectedFile, setSelectedFile] = useState<TreeNode | null>(null);
  const [scrollToLine, setScrollToLine] = useState<number | undefined>();
  const [aiFullscreen, setAiFullscreen] = useState(false);

  // Listen for navigation events from the AI panel
  useEffect(() => {
    const handler = (e: Event) => {
      const { file, line } = (e as CustomEvent).detail;
      // Find the matching tree node
      const found = findNode(DEMO_TREE, file);
      if (found) {
        setSelectedFile(found);
        setScrollToLine(line);
      }
    };
    window.addEventListener('repomind:navigate', handler);
    return () => window.removeEventListener('repomind:navigate', handler);
  }, []);

  const handleNavigate = (file: string, line: number) => {
    const found = findNode(DEMO_TREE, file);
    if (found) {
      setSelectedFile(found);
      setScrollToLine(line);
    }
  };

  return (
    <div className="workspace">
      {/* Workspace header */}
      <div className="workspace-header">
        <button className="btn-ghost" onClick={() => navigate('/repositories')}>← Repositories</button>
        <div className="workspace-repo-info">
          <h1 className="workspace-repo-name">{repo.name}</h1>
          <span className="workspace-repo-lang">{repo.language}</span>
          <span className="workspace-repo-visibility">{repo.visibility}</span>
        </div>
        <button
          className="btn-ghost"
          onClick={() => setAiFullscreen(f => !f)}
        >
          {aiFullscreen ? '⊠ Exit AI' : '🧠 AI Engineer'}
        </button>
      </div>

      {/* 3-column workspace */}
      <div className={`workspace-body${aiFullscreen ? ' workspace-body--ai-fullscreen' : ''}`}>
        {/* Left: File Tree */}
        {!aiFullscreen && (
          <div className="workspace-filetree">
            <div className="panel-title">Files</div>
            <FileTree
              nodes={DEMO_TREE}
              selectedPath={selectedFile?.path ?? ''}
              onSelect={node => { setSelectedFile(node); setScrollToLine(undefined); }}
            />
          </div>
        )}

        {/* Center: Code Viewer */}
        {!aiFullscreen && (
          <div className="workspace-codeviewer">
            <CodeViewer file={selectedFile} scrollToLine={scrollToLine} />
          </div>
        )}

        {/* Right: AI Engineer Panel */}
        <div className={`workspace-ai${aiFullscreen ? ' workspace-ai--fullscreen' : ''}`}>
          {aiFullscreen && (
            <button className="ai-back-btn" onClick={() => setAiFullscreen(false)}>
              ← Back to Workspace
            </button>
          )}
          <ChatPanel repositoryId={id} onNavigate={handleNavigate} />
        </div>
      </div>
    </div>
  );
}

function findNode(nodes: TreeNode[], path: string): TreeNode | null {
  for (const node of nodes) {
    if (node.path === path) return node;
    if (node.children) {
      const found = findNode(node.children, path);
      if (found) return found;
    }
  }
  return null;
}
