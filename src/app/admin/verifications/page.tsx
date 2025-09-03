'use client';

import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

type Verification = {
  id: string;
  full_name: string;
  verification_data: {
    education: string;
    references: string;
    documents: string[];
  };
};

export default function VerificationReviewPage() {
  const supabase = createClient();
  const [verifications, setVerifications] = useState<Verification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingVerifications();
  }, []);

  const fetchPendingVerifications = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, verification_data')
        .eq('role', 'instructor')
        .eq('verified', false)
        .not('verification_data', 'is', null);

      if (error) throw error;
      setVerifications(data || []);
    } catch (error) {
      console.error('Error fetching verifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ verified: true })
        .eq('id', id);

      if (error) throw error;
      setVerifications(verifications.filter(v => v.id !== id));
    } catch (error) {
      console.error('Approval failed:', error);
    }
  };

  const handleReject = async (id: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ verification_data: null })
        .eq('id', id);

      if (error) throw error;
      setVerifications(verifications.filter(v => v.id !== id));
    } catch (error) {
      console.error('Rejection failed:', error);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-8">Instructor Verifications</h1>
      
      {verifications.length === 0 ? (
        <p className="text-center text-gray-500">No pending verifications</p>
      ) : (
        <div className="space-y-6">
          {verifications.map((verification) => (
            <div key={verification.id} className="p-6 border rounded-lg">
              <h2 className="text-xl font-bold mb-4">{verification.full_name}</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Education Background</h3>
                  <p className="whitespace-pre-line">{verification.verification_data.education}</p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Past Lecture References</h3>
                  <p className="whitespace-pre-line">{verification.verification_data.references}</p>
                </div>
              </div>
              
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Supporting Documents</h3>
                <div className="flex flex-wrap gap-2">
                  {verification.verification_data.documents.map((doc) => (
                    <a 
                      key={doc} 
                      href={supabase.storage.from('verification-docs').getPublicUrl(doc).data.publicUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm"
                    >
                      View Document
                    </a>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end space-x-4 mt-6">
                <Button 
                  variant="destructive" 
                  onClick={() => handleReject(verification.id)}
                >
                  Reject
                </Button>
                <Button 
                  variant="default" 
                  onClick={() => handleApprove(verification.id)}
                >
                  Approve
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
