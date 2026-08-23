import { api } from './api';
import type { Repository, AnalysisResult, ChatMessage } from '../types';

export const repositoryService = {
  /** Get all connected repositories */
  getAll: () => api.get<Repository[]>('/repositories'),

  /** Get a single repository by ID */
  getById: (id: string) => api.get<Repository>(`/repositories/${id}`),

  /** Run analysis on a repository */
  analyze: (id: string) => api.post<AnalysisResult>(`/repositories/${id}/analyze`),

  /** Get the latest analysis for a repository */
  getAnalysis: (id: string) => api.get<AnalysisResult>(`/repositories/${id}/analysis`),

  /** Send a chat message about a repository */
  chat: (id: string, message: string) =>
    api.post<ChatMessage>(`/ai/chat`, { repositoryId: id, message }),
};
