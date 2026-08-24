CREATE TABLE user_github_tokens (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    encrypted_access_token TEXT NOT NULL,
    encrypted_refresh_token TEXT,
    iv TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_github_tokens ENABLE ROW LEVEL SECURITY;

-- No policies are created for anon or authenticated roles.
-- This creates a default-deny situation. 
-- ONLY the postgres Service Role (used in Edge Functions) can bypass RLS to read/write.
