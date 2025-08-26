import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const { applicationId } = await request.json();

  if (!applicationId) {
    return new NextResponse('Missing applicationId', { status: 400 });
  }

  try {
    // 1. Fetch application and job details
    const { data: application, error: appError } = await supabase
      .from('job_applications')
      .select('*, job:jobs(company_id, budget)')
      .eq('id', applicationId)
      .single();

    if (appError || !application) {
      throw new Error('Application not found.');
    }

    // 2. Authorization check: ensure the user is the company who posted the job
    if (application.job.company_id !== user.id) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    // 3. Update application status to 'accepted'
    const { error: updateAppError } = await supabase
      .from('job_applications')
      .update({ status: 'accepted' })
      .eq('id', applicationId);

    if (updateAppError) throw updateAppError;

    // 4. Create the contract
    const { error: contractError } = await supabase
      .from('contracts')
      .insert({
        job_id: application.job_id,
        instructor_id: application.instructor_id,
        company_id: user.id,
        budget: application.job.budget,
        status: 'offered',
      });

    if (contractError) throw contractError;

    // 5. Update job status to 'closed'
    const { error: jobUpdateError } = await supabase
      .from('jobs')
      .update({ status: 'closed' })
      .eq('id', application.job_id);

    if (jobUpdateError) throw jobUpdateError;

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error('Error accepting application:', error);
    return new NextResponse(`Error accepting application: ${error.message}`, { status: 500 });
  }
}
