-- Create instructor_rates table
CREATE TABLE IF NOT EXISTS instructor_rates (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  instructor_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  min_rate numeric NOT NULL,
  desired_rate numeric NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create ratings table
CREATE TABLE IF NOT EXISTS ratings (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  instructor_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  company_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  job_id bigint REFERENCES jobs(id) ON DELETE CASCADE,
  score numeric(2,1) CHECK (score BETWEEN 1 AND 5),
  feedback text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Add verification columns to profiles
ALTER TABLE profiles 
  ADD COLUMN IF NOT EXISTS verified boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS verification_data jsonb;
