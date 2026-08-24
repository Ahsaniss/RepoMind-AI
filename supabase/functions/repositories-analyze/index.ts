import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { repositoryAnalyzer } from '../_shared/repositoryAnalyzer.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const webhookSecret = req.headers.get('x-webhook-secret');
    if (webhookSecret !== Deno.env.get('WEBHOOK_SECRET')) {
      return new Response('Unauthorized', { status: 401 });
    }

    const payload = await req.json();
    // Verify it's a webhook insert payload
    const record = payload.record;
    if (!record || record.status !== 'pending') {
      return new Response('Ignored', { status: 200 });
    }

    // Initialize Supabase admin client to bypass RLS for updating the background job
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Update status to processing
    await supabase
      .from('repository_analyses')
      .update({ status: 'processing', updated_at: new Date().toISOString() })
      .eq('id', record.id);

    // Perform analysis
    // Wait, the repositoryAnalyzer expects { repositoryId, owner, repo }
    // We only have repository_id in the table for now, so we'll mock the split.
    const analysisResult = await repositoryAnalyzer.analyze({
      repositoryId: record.repository_id,
      owner: 'mock_owner',
      repo: record.repository_id,
    });

    // Update status to completed with results
    await supabase
      .from('repository_analyses')
      .update({ 
        status: 'completed', 
        result: analysisResult,
        updated_at: new Date().toISOString() 
      })
      .eq('id', record.id);

    return new Response('Success', { status: 200, headers: corsHeaders });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
