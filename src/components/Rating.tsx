'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

type RatingProps = {
  jobId: string;
  instructorId: string;
  onSuccess?: () => void;
};

export default function Rating({ jobId, instructorId, onSuccess }: RatingProps) {
  const supabase = createClient();
  const [score, setScore] = useState<number | null>(null);
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!score) return;
    
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      
      const { error } = await supabase.from('ratings').insert({
        job_id: jobId,
        instructor_id: instructorId,
        company_id: user.id,
        score,
        feedback
      });
      
      if (error) throw error;
      onSuccess?.();
    } catch (error) {
      console.error('Rating submission failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <p className="mb-2">Rate this instructor:</p>
        <div className="flex space-x-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setScore(star)}
              className={`text-2xl ${score && star <= score ? 'text-yellow-500' : 'text-gray-300'}`}
            >
              ★
            </button>
          ))}
        </div>
      </div>
      
      <div>
        <label className="block mb-1">Feedback (optional)</label>
        <textarea
          className="w-full p-2 border rounded"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          rows={3}
        />
      </div>
      
      <button
        onClick={handleSubmit}
        disabled={loading || !score}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Submitting...' : 'Submit Rating'}
      </button>
    </div>
  );
}
