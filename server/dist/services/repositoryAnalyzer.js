"use strict";
/**
 * Repository Analyzer Service
 *
 * Orchestrates code analysis: fetches files, sends them to Gemini, and
 * aggregates the results into an AnalysisResult.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.repositoryAnalyzer = exports.RepositoryAnalyzer = void 0;
class RepositoryAnalyzer {
    /**
     * Run a full analysis on a repository.
     */
    async analyze(_config) {
        // TODO: 1. Fetch file tree via GitHubService
        //       2. Build context via ContextBuilder
        //       3. Send to GeminiService for analysis
        //       4. Parse and return structured results
        return {
            score: 0,
            issues: [],
            summary: 'Analysis not yet implemented.',
            metrics: {
                codeQuality: 0,
                security: 0,
                performance: 0,
                maintainability: 0,
                testCoverage: 0,
                documentation: 0,
            },
        };
    }
}
exports.RepositoryAnalyzer = RepositoryAnalyzer;
exports.repositoryAnalyzer = new RepositoryAnalyzer();
//# sourceMappingURL=repositoryAnalyzer.js.map