import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const supabase = createClient();
  const { jobId } = await request.json();

  // Get job details
  const { data: job, error: jobError } = await supabase
    .from('jobs')
    .select('id, min_budget, max_budget, company_id')
    .eq('id', jobId)
    .single();

  if (jobError || !job) {
    return NextResponse.json(
      { error: jobError?.message || 'Job not found' },
      { status: 400 }
    );
  }

  // Find matching instructors
  const { data: instructors, error: instructorsError } = await supabase
    .from('profiles')
    .select('*, instructor_rates!inner(min_rate, desired_rate)')
    .eq('role', 'instructor')
    .eq('verified', true)
    .gte('instructor_rates.min_rate', job.min_budget)
    .lte('instructor_rates.desired_rate', job.max_budget);

  if (instructorsError) {
    return NextResponse.json(
      { error: instructorsError.message },
      { status: 400 }
    );
  }

  return NextResponse.json({ matches: instructors });
}
