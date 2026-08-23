import { Router } from 'express';
import { getAuthUrl, exchangeCode, getGitHubUser, getGitHubRepos } from '../services/github';

export const githubRouter = Router();

// In-memory token store (replace with session/cookie in production)
let storedToken: string | null = null;

/** GET /api/github/auth — Redirect browser to GitHub OAuth page */
githubRouter.get('/auth', (_req, res) => {
  const url = getAuthUrl();
  res.redirect(url);
});

/** GET /api/github/callback — GitHub redirects here with ?code= */
githubRouter.get('/callback', async (req, res) => {
  const code = req.query.code as string | undefined;
  if (!code) {
    return res.redirect('http://localhost:5174/repositories?error=no_code');
  }
  try {
    storedToken = await exchangeCode(code);
    // Redirect back to the frontend repositories page with success
    res.redirect('http://localhost:5174/repositories?connected=true');
  } catch (err) { console.error("GITHUB ROUTE ERROR:", err);
    console.error('OAuth callback error:', err);
    res.redirect('http://localhost:5174/repositories?error=oauth_failed');
  }
});

/** GET /api/github/user */
githubRouter.get('/user', async (_req, res) => {
  if (!storedToken) return res.status(401).json({ error: 'Not authenticated' });
  try {
    const user = await getGitHubUser(storedToken);
    res.json({
      id: String(user.id),
      login: user.login,
      name: user.name,
      avatarUrl: user.avatar_url,
      email: user.email,
      publicRepos: user.public_repos,
    });
  } catch (err) { console.error("GITHUB ROUTE ERROR:", err);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

/** GET /api/github/repos */
githubRouter.get('/repos', async (_req, res) => {
  if (!storedToken) return res.status(401).json({ error: 'Not authenticated' });
  try {
    const repos = await getGitHubRepos(storedToken);
    res.json(repos.map(r => ({
      id: String(r.id),
      name: r.name,
      fullName: r.full_name,
      description: r.description ?? '',
      language: r.language ?? 'Unknown',
      stars: r.stargazers_count,
      forks: r.forks_count,
      openIssues: r.open_issues_count,
      updatedAt: r.updated_at,
      url: r.html_url,
      defaultBranch: r.default_branch,
      visibility: r.visibility,
      topics: r.topics,
      owner: r.owner.login,
    })));
  } catch (err) { console.error("GITHUB ROUTE ERROR:", err);
    res.status(500).json({ error: 'Failed to fetch repos' });
  }
});

/** GET /api/github/status — Is the user authenticated? */
githubRouter.get('/status', (_req, res) => {
  res.json({ authenticated: !!storedToken });
});

/** POST /api/github/logout */
githubRouter.post('/logout', (_req, res) => {
  storedToken = null;
  res.json({ message: 'Logged out' });
});
