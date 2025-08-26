import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import CompanyDashboard from '@/app/dashboard/company-dashboard';
import InstructorDashboard from '@/app/dashboard/instructor-dashboard';

export default async function DashboardPage() {
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

  if (!profile) {
    // This could happen if the profile creation trigger failed
    // Or if the user was created before the trigger existed
    return <div className="container mx-auto px-6 py-12">Could not find user profile.</div>;
  }

  if (profile.role === 'company') {
    return <CompanyDashboard user={user} />;
  }

  if (profile.role === 'instructor') {
    return <InstructorDashboard user={user} />;
  }

  return <div className="container mx-auto px-6 py-12">Invalid user role.</div>;
}
