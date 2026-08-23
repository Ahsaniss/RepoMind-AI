import { Router } from 'express';
import { chatWithGemini } from '../services/gemini';
import { selectRelevantFiles } from '../services/contextBuilder';

export const aiRouter = Router();

/**
 * POST /api/ai/chat
 * Body: { repositoryId: string, message: string }
 *
 * Selects relevant files via keyword matching, sends them to Gemini,
 * and returns the response with extracted file:line references.
 */
aiRouter.post('/chat', async (req, res) => {
  try {
    const { repositoryId, message } = req.body as {
      repositoryId?: string;
      message?: string;
    };

    if (!repositoryId || !message) {
      res.status(400).json({ error: 'repositoryId and message are required' });
      return;
    }

    // 1. Pick relevant context files (2-5) via keyword matching
    const contextFiles = selectRelevantFiles(message, 5);

    // 2. Call Gemini with context
    const geminiResponse = await chatWithGemini({
      repositoryId,
      message,
      contextFiles: contextFiles.map(f => ({ path: f.path, content: f.content })),
    });

    // 3. Parse file:line references from the response text
    //    Pattern matches things like: src/auth.ts:42  or  src/config.ts:14
    const refPattern = /([\w\/\-.]+\.\w+):(\d+)/g;
    const references: { file: string; line: number }[] = [];
    let match: RegExpExecArray | null;
    while ((match = refPattern.exec(geminiResponse.text)) !== null) {
      references.push({ file: match[1], line: parseInt(match[2], 10) });
    }

    // De-duplicate references
    const uniqueRefs = references.filter(
      (ref, idx, arr) =>
        arr.findIndex(r => r.file === ref.file && r.line === ref.line) === idx
    );

    res.json({
      id: crypto.randomUUID(),
      role: 'assistant',
      content: geminiResponse.text,
      references: uniqueRefs,
      model: geminiResponse.model,
      timestamp: new Date().toISOString(),
      contextFilesUsed: contextFiles.map(f => f.path),
    });
  } catch (error) { console.error("AI ROUTE ERROR:", error);
    console.error('AI chat error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    res.status(500).json({ error: message });
  }
});
