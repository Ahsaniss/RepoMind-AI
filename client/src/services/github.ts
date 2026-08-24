import { api } from './api';
import type { Repository, GitHubUser } from '../types';
import { supabase } from '../supabase';

export const githubService = {
  /** Get the authenticated user's profile */
  getUser: () => api.get<GitHubUser>('/github/user'),

  /** Get all repositories for the authenticated user */
  getRepositories: () => api.get<Repository[]>('/github/repos'),

  /** Start the GitHub OAuth flow */
  login: () => {
    supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        scopes: 'repo',
        redirectTo: 'https://repo-mind-ai-git-main-ahsaniss-projects.vercel.app'
      }
    });
  },

  /** Log out the current user */
  logout: () => supabase.auth.signOut(),
};
