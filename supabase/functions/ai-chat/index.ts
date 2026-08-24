import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { chatWithGemini } from '../_shared/gemini.ts'
import { selectRelevantFiles } from '../_shared/contextBuilder.ts'

// Note: In a real migration, the contextBuilder logic would be moved to a shared Deno module,
// but for this task we will assume it's inline or imported if we configured import maps.
// Since we're just setting up the structure:

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { repositoryId, message } = await req.json();

    if (!repositoryId || !message) {
      return new Response(JSON.stringify({ error: 'repositoryId and message are required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // 1. Pick relevant context files (2-5) via keyword matching
    const contextFiles = selectRelevantFiles(message, 5);

    // 2. Call Gemini with context
    const geminiResponse = await chatWithGemini({
      repositoryId,
      message,
      contextFiles: contextFiles.map((f: any) => ({ path: f.path, content: f.content })),
    });

    // 3. Parse file:line references from the response text
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

    return new Response(JSON.stringify({
      id: crypto.randomUUID(),
      role: 'assistant',
      content: geminiResponse.text,
      references: uniqueRefs,
      model: geminiResponse.model,
      timestamp: new Date().toISOString(),
      contextFilesUsed: contextFiles.map((f: any) => f.path),
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
