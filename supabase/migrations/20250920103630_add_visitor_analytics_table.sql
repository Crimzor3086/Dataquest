-- Create visitor analytics table
CREATE TABLE IF NOT EXISTS visitor_analytics (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    session_id TEXT NOT NULL,
    country_code TEXT,
    country_name TEXT,
    city TEXT,
    page_url TEXT NOT NULL,
    user_agent TEXT,
    referrer TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on visitor_analytics table
ALTER TABLE visitor_analytics ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert visitor analytics
CREATE POLICY "Anyone can insert visitor analytics" ON visitor_analytics
    FOR INSERT WITH CHECK (true);

-- Create policy to allow admins to view all visitor analytics
CREATE POLICY "Admins can view all visitor analytics" ON visitor_analytics
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_visitor_analytics_session_id ON visitor_analytics(session_id);
CREATE INDEX IF NOT EXISTS idx_visitor_analytics_country_code ON visitor_analytics(country_code);
CREATE INDEX IF NOT EXISTS idx_visitor_analytics_created_at ON visitor_analytics(created_at);

