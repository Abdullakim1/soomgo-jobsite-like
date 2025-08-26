'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { type User } from '@supabase/supabase-js';

export default function ApplyButton({ job, user, hasApplied }: { job: { id: string }, user: User, hasApplied: boolean }) {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [applied, setApplied] = useState(hasApplied);

  async function handleApply() {
    setLoading(true);
    try {
      const { error } = await supabase.from('job_applications').insert({
        job_id: job.id,
        instructor_id: user.id,
      });

      if (error) {
        throw error;
      }

      setApplied(true);
      alert('Application submitted successfully!');
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('There was an error submitting your application.');
    } finally {
      setLoading(false);
    }
  }

  if (applied) {
    return (
      <p className="text-green-600 font-semibold mt-8">You have already applied for this job.</p>
    );
  }

  return (
    <div className="mt-8">
      <button
        onClick={handleApply}
        disabled={loading}
        className="w-full px-6 py-3 font-bold text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400"
      >
        {loading ? 'Submitting...' : 'Apply for this Job'}
      </button>
    </div>
  );
}
