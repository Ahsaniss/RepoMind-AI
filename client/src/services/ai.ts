/**
 * AI service — calls the Supabase Edge Function.
 * The browser never sees GEMINI_API_KEY.
 */
import { supabase } from '../supabase';

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  references?: { file: string; line: number }[];
  model?: string;
  contextFilesUsed?: string[];
}

export interface AIChatPayload {
  repositoryId: string;
  message: string;
}

export async function postAIChat(payload: AIChatPayload): Promise<AIMessage> {
  const { data, error } = await supabase.functions.invoke('ai-chat', {
    body: payload,
  });

  if (error) {
    throw new Error(error.message ?? 'AI request failed');
  }

  return data;
}
