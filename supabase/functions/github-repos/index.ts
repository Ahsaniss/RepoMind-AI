import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { decryptToken } from '../_shared/crypto.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing Authorization header' }), { status: 401, headers: corsHeaders });
    }

    // Verify user JWT
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    )
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: corsHeaders });
    }

    // Fetch token using Service Role
    const supabaseService = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { data: tokenRecord, error: tokenError } = await supabaseService
      .from('user_github_tokens')
      .select('encrypted_access_token, iv')
      .eq('user_id', user.id)
      .single();

    if (tokenError || !tokenRecord) {
      return new Response(JSON.stringify({ error: 'GitHub not connected' }), { status: 403, headers: corsHeaders });
    }

    const encryptionKey = Deno.env.get('ENCRYPTION_KEY');
    if (!encryptionKey) {
      throw new Error('ENCRYPTION_KEY is not set');
    }

    const token = await decryptToken(tokenRecord.encrypted_access_token, tokenRecord.iv, encryptionKey);

    const res = await fetch('https://api.github.com/user/repos?per_page=50&sort=updated', {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json' },
    });
    
    if (!res.ok) {
      throw new Error('Failed to fetch GitHub repos');
    }
    
    const repos = await res.json();
    
    const formatted = repos.map((r: any) => ({
      id: String(r.id),
      name: r.name,
      fullName: r.full_name,
      description: r.description ?? '',
      language: r.language ?? 'Unknown',
      stars: r.stargazers_count,
      forks: r.forks_count,
      openIssues: r.open_issues_count,
      updatedAt: r.updated_at,
      url: r.html_url,
      defaultBranch: r.default_branch,
      visibility: r.visibility,
      topics: r.topics,
      owner: r.owner.login,
    }));

    return new Response(JSON.stringify(formatted), {
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
