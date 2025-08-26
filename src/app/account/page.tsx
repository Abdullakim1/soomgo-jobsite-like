import { createClient } from '@/lib/supabase/server';
import AccountForm from '@/app/account/account-form';

export default async function AccountPage() {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-8">Your Account</h1>
      <AccountForm user={user} />
    </div>
  );
}
