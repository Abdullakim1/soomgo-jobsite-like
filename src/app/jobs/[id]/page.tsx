import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import ApplyButton from './apply-button';
import Link from 'next/link';

export default async function JobDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const jobId = params.id;

  const { data: job, error: jobError } = await supabase
    .from('jobs')
    .select(`
      *,
      company:profiles!company_id (id, full_name, avatar_url, website)
    `)
    .eq('id', jobId)
    .single();

  if (jobError || !job) {
    notFound();
  }

  const { data: { user } } = await supabase.auth.getUser();

  let profile = null;
  let hasApplied = false;

  if (user) {
    const { data: userProfile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    profile = userProfile;

    if (profile?.role === 'instructor') {
      const { data: application } = await supabase
        .from('job_applications')
        .select('id')
        .eq('job_id', jobId)
        .eq('instructor_id', user.id)
        .single();
      
      if (application) {
        hasApplied = true;
      }
    }
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <div className="flex items-center mb-6">
          {job.company?.avatar_url && (
            <img src={job.company.avatar_url} alt={`${job.company.full_name}'s avatar`} className="w-16 h-16 rounded-full mr-4" />
          )}
          <div>
            <h1 className="text-4xl font-bold">{job.title}</h1>
            <p className="text-xl text-gray-600">Posted by {job.company?.full_name || 'a company'}</p>
          </div>
        </div>
        
        <div className="prose max-w-none">
          <p>{job.description}</p>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-2xl font-semibold mb-4">Job Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="font-semibold text-gray-700">Budget</p>
              <p>${job.budget}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-700">Status</p>
              <p className={`capitalize font-semibold ${job.status === 'open' ? 'text-green-600' : 'text-gray-600'}`}>{job.status}</p>
            </div>
            {job.company?.website && (
              <div>
                <p className="font-semibold text-gray-700">Company Website</p>
                <a href={job.company.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  {job.company.website}
                </a>
              </div>
            )}
          </div>
        </div>

        {user && profile?.role === 'company' && user.id === job.company?.id && (
          <div className="mt-8">
            <Link href={`/jobs/${job.id}/applicants`} className="w-full block text-center px-6 py-3 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700">
              View Applicants
            </Link>
          </div>
        )}

        {user && profile?.role === 'instructor' && job.status === 'open' && (
          <ApplyButton job={job} user={user} hasApplied={hasApplied} />
        )}
      </div>
    </div>
  );
}
