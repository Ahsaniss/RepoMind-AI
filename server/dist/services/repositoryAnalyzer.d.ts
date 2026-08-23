/**
 * Repository Analyzer Service
 *
 * Orchestrates code analysis: fetches files, sends them to Gemini, and
 * aggregates the results into an AnalysisResult.
 */
export interface AnalysisConfig {
    repositoryId: string;
    owner: string;
    repo: string;
    branch?: string;
}
export declare class RepositoryAnalyzer {
    /**
     * Run a full analysis on a repository.
     */
    analyze(_config: AnalysisConfig): Promise<{
        score: number;
        issues: never[];
        summary: string;
        metrics: {
            codeQuality: number;
            security: number;
            performance: number;
            maintainability: number;
            testCoverage: number;
            documentation: number;
        };
    }>;
}
export declare const repositoryAnalyzer: RepositoryAnalyzer;
//# sourceMappingURL=repositoryAnalyzer.d.ts.map