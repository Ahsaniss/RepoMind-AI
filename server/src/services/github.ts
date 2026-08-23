/**
 * GitHub OAuth Service
 * Client ID / Client Secret are NEVER sent to the browser.
 */

const CLIENT_ID     = process.env.GITHUB_CLIENT_ID     || '';
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET || '';
const REDIRECT_URI  = 'http://localhost:3001/api/github/callback';

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.warn('⚠️  GITHUB_CLIENT_ID / GITHUB_CLIENT_SECRET not set in .env');
}

/** Build the GitHub OAuth authorization URL */
export function getAuthUrl(): string {
  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    scope: 'repo read:user',
    redirect_uri: REDIRECT_URI,
  });
  return `https://github.com/login/oauth/authorize?${params}`;
}

/** Exchange an OAuth code for an access token */
export async function exchangeCode(code: string): Promise<string> {
  const res = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, code, redirect_uri: REDIRECT_URI }),
  });
  const data = await res.json() as { access_token?: string; error?: string };
  if (data.error || !data.access_token) {
    throw new Error(data.error ?? 'Failed to exchange OAuth code');
  }
  return data.access_token;
}

export interface GitHubUser {
  id: number;
  login: string;
  name: string;
  avatar_url: string;
  email: string | null;
  public_repos: number;
}

/** Fetch the authenticated GitHub user */
export async function getGitHubUser(token: string): Promise<GitHubUser> {
  const res = await fetch('https://api.github.com/user', {
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json' },
  });
  if (!res.ok) throw new Error('Failed to fetch GitHub user');
  return res.json() as Promise<GitHubUser>;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  updated_at: string;
  html_url: string;
  default_branch: string;
  visibility: string;
  topics: string[];
  owner: { login: string; avatar_url: string };
}

/** Fetch repositories for the authenticated user */
export async function getGitHubRepos(token: string): Promise<GitHubRepo[]> {
  const res = await fetch('https://api.github.com/user/repos?per_page=50&sort=updated', {
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json' },
  });
  if (!res.ok) throw new Error('Failed to fetch GitHub repos');
  return res.json() as Promise<GitHubRepo[]>;
}
