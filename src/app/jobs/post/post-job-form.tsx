'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function PostJobForm({ userId }: { userId: string }) {
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState<number | ''>('');

  async function handlePostJob() {
    if (!title || !description || !budget) {
      alert('Please fill out all fields.');
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase.from('jobs').insert({
        title,
        description,
        budget,
        company_id: userId,
      });

      if (error) throw error;

      alert('Job posted successfully!');
      router.push('/jobs'); // Redirect to a page where they can see their jobs
    } catch (error) {
      console.error('Error posting job:', error);
      alert('Error posting job. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-2xl p-8 space-y-8 bg-white rounded-lg shadow-md">
      <div className="space-y-6">
        <div>
          <label htmlFor="title" className="text-sm font-medium text-gray-700">Job Title</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="description" className="text-sm font-medium text-gray-700">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="budget" className="text-sm font-medium text-gray-700">Budget ($)</label>
          <input
            id="budget"
            type="number"
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <button
            onClick={handlePostJob}
            className="w-full px-4 py-2 font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={loading}
          >
            {loading ? 'Posting...' : 'Post Job'}
          </button>
        </div>
      </div>
    </div>
  );
}
