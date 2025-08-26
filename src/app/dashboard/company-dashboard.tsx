import { createClient } from '@/lib/supabase/server';
import { type User } from '@supabase/supabase-js';
import Link from 'next/link';

export default async function CompanyDashboard({ user }: { user: User }) {
  const supabase = createClient();

  const { data: jobs, error } = await supabase
    .from('jobs')
    .select('id, title, status, (select count(*) from job_applications where job_id = jobs.id) as applicant_count')
    .eq('company_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching company jobs:', error);
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Company Dashboard</h1>
          <Link href="/dashboard/contracts" className="text-sm text-blue-600 hover:underline">View All Contracts</Link>
        </div>
        <Link href="/jobs/post" className="px-4 py-2 text-white bg-blue-600 rounded-md">
          Post a New Job
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold p-6 border-b">Your Job Postings</h2>
        <ul className="divide-y divide-gray-200">
          {jobs && jobs.length > 0 ? (
            jobs.map((job: any) => (
              <li key={job.id} className="p-6 flex items-center justify-between hover:bg-gray-50">
                <div>
                  <Link href={`/jobs/${job.id}`} className="font-bold text-lg hover:text-blue-600">
                    {job.title}
                  </Link>
                  <p className={`text-sm capitalize font-semibold ${job.status === 'open' ? 'text-green-600' : 'text-gray-600'}`}>{job.status}</p>
                </div>
                <Link href={`/jobs/${job.id}/applicants`} className="text-sm text-blue-600 hover:underline">
                  {job.applicant_count} {job.applicant_count === 1 ? 'Applicant' : 'Applicants'}
                </Link>
              </li>
            ))
          ) : (
            <li className="p-6 text-center text-gray-500">You haven't posted any jobs yet.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
