-- Create jobs table for tracking agent runs
CREATE TABLE IF NOT EXISTS jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  governorate TEXT NOT NULL,
  category TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'done', 'failed')),
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  current_step TEXT,
  retry_count INTEGER DEFAULT 0 CHECK (retry_count >= 0),
  error_message TEXT,
  businesses_found INTEGER DEFAULT 0,
  businesses_saved INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Create staging_businesses table for immediate persistence
CREATE TABLE IF NOT EXISTS staging_businesses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  governorate TEXT NOT NULL,
  city TEXT NOT NULL,
  phone TEXT,
  source TEXT NOT NULL,
  confidence DECIMAL(3,2) DEFAULT 0.5 CHECK (confidence >= 0 AND confidence <= 1),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'duplicate', 'promoted', 'rejected')),
  duplicate_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create final businesses table for approved data
CREATE TABLE IF NOT EXISTS businesses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  governorate TEXT NOT NULL,
  city TEXT NOT NULL,
  phone TEXT,
  source TEXT NOT NULL,
  confidence DECIMAL(3,2) DEFAULT 0.5 CHECK (confidence >= 0 AND confidence <= 1),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_governorate ON jobs(governorate);
CREATE INDEX IF NOT EXISTS idx_jobs_category ON jobs(category);
CREATE INDEX IF NOT EXISTS idx_jobs_created_at ON jobs(created_at);

CREATE INDEX IF NOT EXISTS idx_staging_businesses_job_id ON staging_businesses(job_id);
CREATE INDEX IF NOT EXISTS idx_staging_businesses_status ON staging_businesses(status);
CREATE INDEX IF NOT EXISTS idx_staging_businesses_name ON staging_businesses(name);

CREATE INDEX IF NOT EXISTS idx_businesses_city ON businesses(city);
CREATE INDEX IF NOT EXISTS idx_businesses_category ON businesses(category);
CREATE INDEX IF NOT EXISTS idx_businesses_name ON businesses(name);
CREATE INDEX IF NOT EXISTS idx_businesses_phone ON businesses(phone);

-- Add unique constraint to prevent exact duplicates in final businesses
ALTER TABLE businesses ADD CONSTRAINT unique_business_name_phone 
  UNIQUE (name, phone) 
  WHERE phone IS NOT NULL AND phone != '';

-- Enable RLS (Row Level Security)
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE staging_businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Public read access - jobs" ON jobs
  FOR SELECT USING (true);

CREATE POLICY "Public read access - staging_businesses" ON staging_businesses
  FOR SELECT USING (true);

CREATE POLICY "Public read access - businesses" ON businesses
  FOR SELECT USING (true);

-- Service role bypasses RLS for writes, but create policies for completeness
CREATE POLICY "Service insert - jobs" ON jobs
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Service update - jobs" ON jobs
  FOR UPDATE USING (true);

CREATE POLICY "Service insert - staging_businesses" ON staging_businesses
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Service update - staging_businesses" ON staging_businesses
  FOR UPDATE USING (true);

CREATE POLICY "Service insert - businesses" ON businesses
  FOR INSERT WITH CHECK (true);
