import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

export default async function JobsPage() {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();

  let profile = null;
  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    profile = data;
  }

  let jobsQuery = supabase.from('jobs').select('*, profiles (full_name, avatar_url)');

  if (profile?.role === 'company') {
    jobsQuery = jobsQuery.eq('company_id', user!.id);
  } else {
    jobsQuery = jobsQuery.eq('status', 'open');
  }

  const { data: jobs, error } = await jobsQuery.order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching jobs:', error);
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{profile?.role === 'company' ? 'Your Job Postings' : 'Available Jobs'}</h1>
        {profile?.role === 'company' && (
          <Link href="/jobs/post" className="px-4 py-2 text-white bg-blue-600 rounded-md">
            Post a New Job
          </Link>
        )}
      </div>
      <div className="space-y-6">
        {jobs && jobs.length > 0 ? (
          jobs.map((job) => (
            <div key={job.id} className="p-6 bg-white rounded-lg shadow-md">
              <Link href={`/jobs/${job.id}`}><h2 className="text-2xl font-bold mb-2 hover:text-blue-600">{job.title}</h2></Link>
              <p className="text-gray-600 mb-4">{job.description}</p>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>Budget: ${job.budget}</span>
                <span>Status: <span className={`font-semibold ${job.status === 'open' ? 'text-green-600' : 'text-gray-600'}`}>{job.status}</span></span>
              </div>
            </div>
          ))
        ) : (
          <p>{profile?.role === 'company' ? "You haven't posted any jobs yet." : 'No open jobs available at the moment.'}</p>
        )}
      </div>
    </div>
  );
}
