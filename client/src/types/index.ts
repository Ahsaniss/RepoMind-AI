// ─── Repository & GitHub ───────────────────────────────────────

export interface Repository {
  id: string;
  name: string;
  fullName: string;
  description: string;
  language: string;
  stars: number;
  forks: number;
  openIssues: number;
  lastUpdated: string;
  owner: string;
  avatarUrl: string;
  url: string;
  defaultBranch: string;
  visibility: 'public' | 'private';
  topics: string[];
}

export interface RepositoryFile {
  name: string;
  path: string;
  type: 'file' | 'dir';
  size?: number;
  content?: string;
  language?: string;
}

export interface GitHubUser {
  id: string;
  login: string;
  name: string;
  avatarUrl: string;
  email: string;
  bio?: string;
  publicRepos: number;
}

// ─── Analysis ──────────────────────────────────────────────────

export type Severity = 'critical' | 'high' | 'medium' | 'low' | 'info';

export interface AnalysisIssue {
  id: string;
  title: string;
  description: string;
  severity: Severity;
  category: 'bug' | 'security' | 'performance' | 'style' | 'architecture';
  file: string;
  line?: number;
  suggestion?: string;
}

export interface AnalysisResult {
  repositoryId: string;
  timestamp: string;
  score: number; // 0–100
  issues: AnalysisIssue[];
  summary: string;
  metrics: AnalysisMetrics;
}

export interface AnalysisMetrics {
  codeQuality: number;
  security: number;
  performance: number;
  maintainability: number;
  testCoverage: number;
  documentation: number;
}

// ─── AI Chat ───────────────────────────────────────────────────

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  codeBlocks?: CodeBlock[];
}

export interface CodeBlock {
  language: string;
  code: string;
  file?: string;
}

export interface ChatSession {
  id: string;
  repositoryId: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

// ─── Activity ──────────────────────────────────────────────────

export interface ActivityItem {
  id: string;
  type: 'analysis' | 'chat' | 'fix' | 'commit' | 'review';
  title: string;
  description: string;
  timestamp: string;
  repositoryId?: string;
  repositoryName?: string;
}

// ─── Dashboard ─────────────────────────────────────────────────

export interface DashboardStats {
  totalRepositories: number;
  totalIssuesFound: number;
  issuesFixed: number;
  aiInteractions: number;
  averageScore: number;
}
