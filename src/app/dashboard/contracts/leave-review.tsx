'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function LeaveReview({ contract, onReviewSubmit }: { contract: any, onReviewSubmit: () => void }) {
  const supabase = createClient();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.from('reviews').insert({
        contract_id: contract.id,
        instructor_id: contract.instructor_id,
        company_id: contract.company_id,
        rating,
        comment,
      });

      if (error) throw error;

      onReviewSubmit(); // Notify parent to update UI
      setShowForm(false);

    } catch (error: any) {
      console.error('Error submitting review:', error);
      alert(`Failed to submit review: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!showForm) {
    return (
      <button
        onClick={() => setShowForm(true)}
        className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700"
      >
        Leave a Review
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-gray-50 rounded-lg">
      <h4 className="font-bold mb-2">Leave a Review</h4>
      <div className="mb-4">
        <label htmlFor="rating" className="block text-sm font-medium text-gray-700">Rating (1-5)</label>
        <input
          type="number"
          id="rating"
          min="1"
          max="5"
          value={rating}
          onChange={(e) => setRating(parseInt(e.target.value, 10))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="comment" className="block text-sm font-medium text-gray-700">Comment</label>
        <textarea
          id="comment"
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      <div className="flex justify-end space-x-2">
        <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-gray-600">Cancel</button>
        <button type="submit" disabled={loading} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-400">
          Submit Review
        </button>
      </div>
    </form>
  );
}
