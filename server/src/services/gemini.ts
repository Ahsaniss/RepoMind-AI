/**
 * Gemini AI Service
 *
 * Uses the @google/genai SDK (v2.x).
 * The GEMINI_API_KEY is read from process.env — never sent to the browser.
 */
import { GoogleGenAI } from '@google/genai';

// Fast, cost‑efficient flagship as of Aug 2026
const MODEL = 'gemini-2.5-flash';

const SYSTEM_INSTRUCTION = `You are RepoMind AI, an expert senior software engineer analyzing a real repository.
Understand architecture and file relationships, identify bugs, security risks, and performance problems,
explain code, generate tests/docs, recommend refactors, and generate safe fixes.
Ground every answer in the provided repository context — never invent files, functions, or APIs that aren't present.
When flagging an issue give: a concise title, severity (critical/high/medium/low), file path with line numbers if available,
why it matters, and a recommended fix with a code block.
Format file references exactly as: filename.ext:LINE_NUMBER (e.g. src/auth.ts:42).
You are an engineering assistant, not a general chatbot.`;

let genai: GoogleGenAI | null = null;

function getClient(): GoogleGenAI {
  if (!genai) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not set in environment variables.');
    }
    genai = new GoogleGenAI({ apiKey });
  }
  return genai;
}

export interface ChatRequest {
  repositoryId: string;
  message: string;
  contextFiles: { path: string; content: string }[];
}

export interface ChatResponse {
  text: string;
  model: string;
}

/**
 * Send a question with repository file context to Gemini and return the response.
 */
export async function chatWithGemini(req: ChatRequest): Promise<ChatResponse> {
  const client = getClient();

  // Build the prompt: system + repo context + user question
  const fileContext = req.contextFiles
    .map(f => `=== File: ${f.path} ===\n${f.content}`)
    .join('\n\n');

  const userPrompt = fileContext
    ? `Repository: ${req.repositoryId}\n\n${fileContext}\n\n---\n\nQuestion: ${req.message}`
    : `Repository: ${req.repositoryId}\n\nQuestion: ${req.message}`;

  const response = await client.models.generateContent({
    model: MODEL,
    contents: userPrompt,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      temperature: 0.3,
    },
  });

  const text = response.text ?? '';
  return { text, model: MODEL };
}
