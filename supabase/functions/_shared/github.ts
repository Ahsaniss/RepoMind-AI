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
