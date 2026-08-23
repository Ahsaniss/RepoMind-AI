export interface ChatRequest {
    repositoryId: string;
    message: string;
    contextFiles: {
        path: string;
        content: string;
    }[];
}
export interface ChatResponse {
    text: string;
    model: string;
}
/**
 * Send a question with repository file context to Gemini and return the response.
 */
export declare function chatWithGemini(req: ChatRequest): Promise<ChatResponse>;
//# sourceMappingURL=gemini.d.ts.map