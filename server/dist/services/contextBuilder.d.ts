/**
 * Context Builder Service
 *
 * Selects up to 5 relevant demo-repo files based on keyword matching
 * between the user question and file paths/content.
 * This keeps the Gemini prompt focused and avoids sending the whole repo.
 */
export interface DemoFile {
    path: string;
    language: string;
    content: string;
}
export declare const DEMO_FILES: DemoFile[];
/**
 * Select up to `limit` (default 5) files most relevant to the given question.
 */
export declare function selectRelevantFiles(question: string, limit?: number): DemoFile[];
//# sourceMappingURL=contextBuilder.d.ts.map