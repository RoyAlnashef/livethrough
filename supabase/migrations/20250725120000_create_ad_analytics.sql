-- Create ad_analytics table for tracking ad performance
CREATE TABLE IF NOT EXISTS ad_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slot_id TEXT NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('impression', 'click')),
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_ad_analytics_slot_id ON ad_analytics(slot_id);
CREATE INDEX IF NOT EXISTS idx_ad_analytics_event_type ON ad_analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_ad_analytics_timestamp ON ad_analytics(timestamp);
CREATE INDEX IF NOT EXISTS idx_ad_analytics_slot_event ON ad_analytics(slot_id, event_type);

-- Create a view for aggregated analytics
CREATE OR REPLACE VIEW ad_analytics_summary AS
SELECT 
  slot_id,
  COUNT(*) as total_events,
  COUNT(CASE WHEN event_type = 'impression' THEN 1 END) as impressions,
  COUNT(CASE WHEN event_type = 'click' THEN 1 END) as clicks,
  CASE 
    WHEN COUNT(CASE WHEN event_type = 'impression' THEN 1 END) > 0 
    THEN ROUND(
      (COUNT(CASE WHEN event_type = 'click' THEN 1 END)::DECIMAL / 
       COUNT(CASE WHEN event_type = 'impression' THEN 1 END)::DECIMAL) * 100, 2
    )
    ELSE 0 
  END as ctr
FROM ad_analytics
GROUP BY slot_id;

-- Add RLS (Row Level Security) - only admins can access
ALTER TABLE ad_analytics ENABLE ROW LEVEL SECURITY;

-- Policy: Only admins can read analytics data
CREATE POLICY "Admins can read ad analytics" ON ad_analytics
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- Policy: Anyone can insert analytics events (for tracking)
CREATE POLICY "Anyone can insert ad analytics" ON ad_analytics
  FOR INSERT WITH CHECK (true);

-- Grant necessary permissions
GRANT SELECT ON ad_analytics TO authenticated;
GRANT INSERT ON ad_analytics TO authenticated;
GRANT SELECT ON ad_analytics_summary TO authenticated; 