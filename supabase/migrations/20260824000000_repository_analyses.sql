CREATE TABLE repository_analyses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    repository_id TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    result JSONB,
    error_message TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    
    -- Ensure one active/cached analysis per repo per user
    UNIQUE(user_id, repository_id)
);

-- Enable RLS so users can only see and insert their own analyses
ALTER TABLE repository_analyses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own analyses" 
    ON repository_analyses FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own analyses" 
    ON repository_analyses FOR INSERT 
    WITH CHECK (auth.uid() = user_id);
    
CREATE POLICY "Users can update their own analyses" 
    ON repository_analyses FOR UPDATE 
    USING (auth.uid() = user_id);
