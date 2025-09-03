'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function VerificationPage() {
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [education, setEducation] = useState('');
  const [references, setReferences] = useState('');

  const handleSubmit = async () => {
    setLoading(true);
    
    try {
      // Upload documents
      const uploadPromises = files.map(async (file) => {
        const { data, error } = await supabase.storage
          .from('verification-docs')
          .upload(`user_uploads/${file.name}`, file);
        
        if (error) throw error;
        return data.path;
      });
      
      const uploadedPaths = await Promise.all(uploadPromises);
      
      // Save verification data
      const { error } = await supabase
        .from('profiles')
        .update({
          verification_data: {
            education,
            references,
            documents: uploadedPaths
          }
        })
        .eq('id', (await supabase.auth.getUser()).data.user?.id);
      
      if (error) throw error;
      
      router.push('/account?verification_submitted=true');
    } catch (error) {
      console.error('Verification submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Instructor Verification</h1>
      
      <div className="space-y-4">
        <div>
          <label className="block mb-1">Education Background</label>
          <textarea
            className="w-full p-2 border rounded"
            value={education}
            onChange={(e) => setEducation(e.target.value)}
            rows={3}
          />
        </div>
        
        <div>
          <label className="block mb-1">Past Lecture References</label>
          <textarea
            className="w-full p-2 border rounded"
            value={references}
            onChange={(e) => setReferences(e.target.value)}
            rows={3}
          />
        </div>
        
        <div>
          <label className="block mb-1">Supporting Documents</label>
          <input 
            type="file" 
            multiple
            onChange={(e) => setFiles(Array.from(e.target.files || []))}
            className="w-full p-2 border rounded"
          />
          <p className="text-sm text-gray-500 mt-1">
            Upload diplomas, certificates, or reference letters
          </p>
        </div>
        
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Submit Verification'}
        </button>
      </div>
    </div>
  );
}
