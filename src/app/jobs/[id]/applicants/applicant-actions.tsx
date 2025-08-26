'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function ApplicantActions({ application }: { application: { id: number, status: string } }) {
  const supabase = createClient();
  const [currentStatus, setCurrentStatus] = useState(application.status);
  const [loading, setLoading] = useState(false);

  const updateStatus = async (newStatus: 'accepted' | 'rejected') => {
    setLoading(true);
    try {
      if (newStatus === 'accepted') {
        // Use the secure API route to handle acceptance and contract creation
        const response = await fetch('/api/applications/accept', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ applicationId: application.id }),
        });

        if (!response.ok) {
          const errorData = await response.text();
          throw new Error(errorData || 'Failed to accept application.');
        }

      } else {
        // 'rejected' can still be a direct update
        const { error } = await supabase
          .from('job_applications')
          .update({ status: newStatus })
          .eq('id', application.id);

        if (error) throw error;
      }

      setCurrentStatus(newStatus);

    } catch (error: any) {
      console.error('Error updating application status:', error);
      alert(`Failed to update application status: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (currentStatus !== 'pending') {
    return <p className={`font-semibold capitalize ${currentStatus === 'accepted' ? 'text-green-600' : 'text-red-600'}`}>{currentStatus}</p>;
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={() => updateStatus('accepted')}
        disabled={loading}
        className="px-3 py-1 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:bg-gray-400"
      >
        Accept
      </button>
      <button
        onClick={() => updateStatus('rejected')}
        disabled={loading}
        className="px-3 py-1 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:bg-gray-400"
      >
        Reject
      </button>
    </div>
  );
}
