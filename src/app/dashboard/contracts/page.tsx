import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import ContractActions from './contract-actions';

export default async function ContractsPage() {
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

  let contractsQuery = supabase
    .from('contracts')
    .select(`
      id,
      status,
      budget,
      job:jobs(id, title),
      company:profiles!company_id(full_name),
      instructor:profiles!instructor_id(full_name),
      reviews(count)
    `)
    .order('created_at', { ascending: false });

  if (profile?.role === 'instructor') {
    contractsQuery = contractsQuery.eq('instructor_id', user.id);
  } else if (profile?.role === 'company') {
    contractsQuery = contractsQuery.eq('company_id', user.id);
  } else {
    return <div className="container mx-auto px-6 py-12">Invalid user role.</div>;
  }

  const { data: contracts, error } = await contractsQuery;

  if (error) {
    console.error('Error fetching contracts:', error);
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Your Contracts</h1>
        <Link href="/dashboard" className="text-blue-600 hover:underline">&larr; Back to Dashboard</Link>
      </div>

      <div className="bg-white rounded-lg shadow-md">
        <ul className="divide-y divide-gray-200">
          {contracts && contracts.length > 0 ? (
            contracts.map((contract: any) => (
              <li key={contract.id} className="p-6 flex items-center justify-between">
                <div>
                  <Link href={`/jobs/${contract.job.id}`} className="font-bold text-lg hover:text-blue-600">
                    {contract.job.title}
                  </Link>
                  <p className="text-sm text-gray-600">
                    {profile?.role === 'company' ? `with ${contract.instructor.full_name}` : `from ${contract.company.full_name}`}
                  </p>
                  <p className="text-sm text-gray-600">Budget: ${contract.budget}</p>
                </div>
                <div className="text-right">
                  <ContractActions contract={contract} user={user} />
                </div>
              </li>
            ))
          ) : (
            <li className="p-6 text-center text-gray-500">You have no contracts yet.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
