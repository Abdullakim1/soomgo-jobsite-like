import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import PostJobForm from '@/app/jobs/post/post-job-form';

export default async function PostJobPage() {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'company') {
    // Or redirect to an unauthorized page
    redirect('/');
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-8">Post a New Job</h1>
      <PostJobForm userId={user.id} />
    </div>
  );
}
