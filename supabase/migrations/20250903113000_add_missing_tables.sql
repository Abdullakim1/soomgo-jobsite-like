-- Create instructor rates table
CREATE TABLE instructor_rates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  instructor_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  min_rate NUMERIC NOT NULL,
  desired_rate NUMERIC NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create verification system
ALTER TABLE profiles ADD COLUMN verified BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN verification_data JSONB;

-- Create ratings system
CREATE TABLE ratings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  instructor_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  company_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  score NUMERIC(2,1) CHECK (score BETWEEN 1 AND 5),
  feedback TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add average rating view
CREATE VIEW instructor_avg_ratings AS
SELECT 
  instructor_id,
  AVG(score) as avg_score,
  COUNT(*) as rating_count
FROM ratings
GROUP BY instructor_id;
