import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { CheckCircleIcon, ExclamationTriangleIcon } from '@/components/icons';

export default async function VerificationStatus() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('verified, verification_data')
    .eq('id', user.id)
    .single();

  if (!profile) return null;

  return (
    <div className="p-4 border rounded-lg mb-6">
      <h3 className="font-bold mb-2">Verification Status</h3>
      {profile.verified ? (
        <div className="flex items-center text-green-600">
          <CheckCircleIcon className="w-5 h-5 mr-2" />
          <span>Verified Instructor</span>
        </div>
      ) : (
        <div>
          <div className="flex items-center text-yellow-600 mb-2">
            <ExclamationTriangleIcon className="w-5 h-5 mr-2" />
            <span>Pending Verification</span>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            Please submit your documents for verification
          </p>
          <Link 
            href="/account/verify" 
            className="text-sm text-blue-600 hover:underline"
          >
            Complete Verification
          </Link>
        </div>
      )}
    </div>
  );
}
