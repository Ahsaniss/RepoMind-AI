import type {
  Repository,
  AnalysisResult,
  DashboardStats,
  ActivityItem,
} from '../types';

export const demoRepository: Repository = {
  id: 'demo-1',
  name: 'repomind-demo',
  fullName: 'demo-user/repomind-demo',
  description: 'A sample full-stack TypeScript project for demonstrating RepoMind AI.',
  language: 'TypeScript',
  stars: 128,
  forks: 34,
  openIssues: 12,
  lastUpdated: new Date().toISOString(),
  owner: 'demo-user',
  avatarUrl: 'https://api.dicebear.com/7.x/identicon/svg?seed=demo-user',
  url: 'https://github.com/demo-user/repomind-demo',
  defaultBranch: 'main',
  visibility: 'public',
  topics: ['typescript', 'react', 'node', 'demo'],
};

export const demoRepositories: Repository[] = [
  demoRepository,
  {
    id: 'demo-2',
    name: 'api-gateway',
    fullName: 'demo-user/api-gateway',
    description: 'High-performance API gateway with rate limiting and caching.',
    language: 'Go',
    stars: 256,
    forks: 67,
    openIssues: 5,
    lastUpdated: new Date(Date.now() - 86400000).toISOString(),
    owner: 'demo-user',
    avatarUrl: 'https://api.dicebear.com/7.x/identicon/svg?seed=demo-user',
    url: 'https://github.com/demo-user/api-gateway',
    defaultBranch: 'main',
    visibility: 'public',
    topics: ['go', 'api', 'gateway', 'microservices'],
  },
  {
    id: 'demo-3',
    name: 'ml-pipeline',
    fullName: 'demo-user/ml-pipeline',
    description: 'End-to-end machine learning pipeline with automated training.',
    language: 'Python',
    stars: 89,
    forks: 21,
    openIssues: 8,
    lastUpdated: new Date(Date.now() - 172800000).toISOString(),
    owner: 'demo-user',
    avatarUrl: 'https://api.dicebear.com/7.x/identicon/svg?seed=demo-user',
    url: 'https://github.com/demo-user/ml-pipeline',
    defaultBranch: 'main',
    visibility: 'private',
    topics: ['python', 'ml', 'data-science'],
  },
];

export const demoAnalysis: AnalysisResult = {
  repositoryId: 'demo-1',
  timestamp: new Date().toISOString(),
  score: 78,
  summary:
    'Good overall code quality with some security concerns around environment variable handling and a few performance issues in database queries.',
  issues: [
    {
      id: 'issue-1',
      title: 'Hardcoded API key in config',
      description:
        'An API key is hardcoded in src/config.ts instead of being read from environment variables.',
      severity: 'critical',
      category: 'security',
      file: 'src/config.ts',
      line: 14,
      suggestion: 'Move the key to a .env file and access it via process.env.',
    },
    {
      id: 'issue-2',
      title: 'Missing input validation',
      description:
        'User input in the login handler is not validated before being passed to the database query.',
      severity: 'high',
      category: 'security',
      file: 'src/routes/auth.ts',
      line: 42,
      suggestion: 'Add schema validation with zod or joi before processing user input.',
    },
    {
      id: 'issue-3',
      title: 'N+1 query in user list',
      description:
        'Each user row triggers a separate query for related data, causing performance degradation.',
      severity: 'medium',
      category: 'performance',
      file: 'src/services/userService.ts',
      line: 88,
      suggestion: 'Use a JOIN or batch query to load related data in one trip.',
    },
    {
      id: 'issue-4',
      title: 'Unused dependency',
      description: 'The lodash package is listed in dependencies but never imported.',
      severity: 'low',
      category: 'style',
      file: 'package.json',
      suggestion: 'Remove lodash from dependencies.',
    },
  ],
  metrics: {
    codeQuality: 82,
    security: 58,
    performance: 74,
    maintainability: 85,
    testCoverage: 65,
    documentation: 70,
  },
};

export const demoDashboardStats: DashboardStats = {
  totalRepositories: 3,
  totalIssuesFound: 25,
  issuesFixed: 18,
  aiInteractions: 142,
  averageScore: 78,
};

export const demoActivity: ActivityItem[] = [
  {
    id: 'act-1',
    type: 'analysis',
    title: 'Analysis completed',
    description: 'Full codebase analysis of repomind-demo — found 4 issues.',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    repositoryId: 'demo-1',
    repositoryName: 'repomind-demo',
  },
  {
    id: 'act-2',
    type: 'chat',
    title: 'AI conversation',
    description: 'Discussed authentication best practices for api-gateway.',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    repositoryId: 'demo-2',
    repositoryName: 'api-gateway',
  },
  {
    id: 'act-3',
    type: 'fix',
    title: 'Issue resolved',
    description: 'Fixed hardcoded API key in src/config.ts.',
    timestamp: new Date(Date.now() - 10800000).toISOString(),
    repositoryId: 'demo-1',
    repositoryName: 'repomind-demo',
  },
];
