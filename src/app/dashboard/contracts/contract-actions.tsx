'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { type User } from '@supabase/supabase-js';
import LeaveReview from './leave-review';

export default function ContractActions({ contract, user }: { contract: any, user: User }) {
  const supabase = createClient();
  const [currentStatus, setCurrentStatus] = useState(contract.status);
  const [hasReview, setHasReview] = useState(contract.reviews[0]?.count > 0);
  const [loading, setLoading] = useState(false);

  const signContract = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('contracts')
        .update({ status: 'signed', signed_at: new Date().toISOString() })
        .eq('id', contract.id);

      if (error) throw error;

      setCurrentStatus('signed');
    } catch (error: any) {
      console.error('Error signing contract:', error);
      alert(`Failed to sign contract: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const redirectToCheckout = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/checkout_sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contractId: contract.id }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session.');
      }

      const { url } = await response.json();
      window.location.href = url;

    } catch (error: any) {
      console.error('Error redirecting to checkout:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Instructor's view
  if (user.id === contract.instructor_id) {
    if (currentStatus === 'offered') {
      return (
        <button
          onClick={signContract}
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
        >
          Sign Contract
        </button>
      );
    }
    return <p className={`font-semibold capitalize ${currentStatus === 'paid' ? 'text-purple-600' : 'text-gray-600'}`}>{currentStatus}</p>;
  }

  // Company's view
  if (user.id === contract.company_id) {
    if (currentStatus === 'signed') {
      return (
        <button
          onClick={redirectToCheckout}
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:bg-gray-400"
        >
          Pay Now
        </button>
      );
    }

    if (currentStatus === 'paid' && !hasReview) {
      return <LeaveReview contract={contract} onReviewSubmit={() => setHasReview(true)} />;
    }

    return <p className={`font-semibold capitalize ${currentStatus === 'paid' ? 'text-purple-600' : 'text-gray-600'}`}>{currentStatus}</p>;
  }

  return null;
}
