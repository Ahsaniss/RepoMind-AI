import { api } from './api';
import type { Repository, GitHubUser } from '../types';

export const githubService = {
  /** Get the authenticated user's profile */
  getUser: () => api.get<GitHubUser>('/github/user'),

  /** Get all repositories for the authenticated user */
  getRepositories: () => api.get<Repository[]>('/github/repos'),

  /** Start the GitHub OAuth flow */
  login: () => {
    window.location.href = '/api/github/auth';
  },

  /** Log out the current user */
  logout: () => api.post<void>('/github/logout'),
};
