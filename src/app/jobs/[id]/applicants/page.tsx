import { createClient } from '@/lib/supabase/server';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import ApplicantActions from './applicant-actions';

export default async function ApplicantsPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const jobId = params.id;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }

  const { data: job, error: jobError } = await supabase
    .from('jobs')
    .select('id, title, company_id')
    .eq('id', jobId)
    .single();

  if (jobError || !job) {
    notFound();
  }

  if (job.company_id !== user.id) {
    redirect(`/jobs/${jobId}`);
  }

  const { data: applications, error: applicationsError } = await supabase
    .from('job_applications')
    .select(`
      id,
      created_at,
      status,
      instructor:profiles!instructor_id (id, full_name, avatar_url, website)
    `)
    .eq('job_id', jobId)
    .order('created_at', { ascending: false });

  if (applicationsError) {
    console.error('Error fetching applicants:', applicationsError);
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="mb-8">
        <Link href={`/jobs/${jobId}`} className="text-blue-600 hover:underline">&larr; Back to Job Details</Link>
        <h1 className="text-3xl font-bold mt-2">Applicants for {job.title}</h1>
      </div>

      <div className="bg-white rounded-lg shadow-md">
        <ul className="divide-y divide-gray-200">
          {applications && applications.length > 0 ? (
            applications.map((app: any) => (
              <li key={app.instructor.id} className="p-6 flex items-center justify-between">
                <div className="flex items-center">
                  {app.instructor.avatar_url && (
                    <img src={app.instructor.avatar_url} alt="" className="w-12 h-12 rounded-full mr-4" />
                  )}
                  <div>
                    <Link href={`/profiles/${app.instructor.id}`} className="font-bold text-lg hover:text-blue-600">
                      {app.instructor.full_name}
                    </Link>
                    {app.instructor.website && (
                      <a href={app.instructor.website} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                        {app.instructor.website}
                      </a>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Applied on {new Date(app.created_at).toLocaleDateString()}</p>
                  <ApplicantActions application={app} />
                </div>
              </li>
            ))
          ) : (
            <li className="p-6 text-center text-gray-500">No applicants yet.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
