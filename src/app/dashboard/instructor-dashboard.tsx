import { createClient } from '@/lib/supabase/server';
import { type User } from '@supabase/supabase-js';
import Link from 'next/link';

export default async function InstructorDashboard({ user }: { user: User }) {
  const supabase = createClient();

  const { data: applications, error } = await supabase
    .from('job_applications')
    .select(`
      status,
      job:jobs!inner(id, title, budget)
    `)
    .eq('instructor_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching instructor applications:', error);
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Instructor Dashboard</h1>
          <Link href="/dashboard/contracts" className="text-sm text-blue-600 hover:underline">View All Contracts</Link>
        </div>
        <Link href="/jobs" className="px-4 py-2 text-white bg-blue-600 rounded-md">
          Find New Jobs
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold p-6 border-b">Your Job Applications</h2>
        <ul className="divide-y divide-gray-200">
          {applications && applications.length > 0 ? (
            applications.map((app: any) => (
              <li key={app.job.id} className="p-6 flex items-center justify-between hover:bg-gray-50">
                <div>
                  <Link href={`/jobs/${app.job.id}`} className="font-bold text-lg hover:text-blue-600">
                    {app.job.title}
                  </Link>
                  <p className="text-sm text-gray-600">Budget: ${app.job.budget}</p>
                </div>
                <p className={`font-semibold capitalize ${app.status === 'pending' ? 'text-yellow-600' : app.status === 'accepted' ? 'text-green-600' : 'text-red-600'}`}>
                  {app.status}
                </p>
              </li>
            ))
          ) : (
            <li className="p-6 text-center text-gray-500">You haven't applied to any jobs yet.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
