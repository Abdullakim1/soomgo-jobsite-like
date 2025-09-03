import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import VerificationStatus from '@/components/VerificationStatus';

export default async function ProfilePage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const profileId = params.id;

  const { data: profile, error } = await supabase
    .from('profiles')
    .select(`
      full_name,
      avatar_url,
      website,
      role,
      verified,
      ratings:ratings!instructor_id(score, feedback, created_at, company:profiles!company_id(full_name)),
      avg_rating:instructor_avg_ratings(avg_score, rating_count)
    `)
    .eq('id', profileId)
    .single();

  if (error || !profile || profile.role !== 'instructor') {
    notFound();
  }

  const avgRating = profile.avg_rating?.[0]?.avg_score || 0;
  const ratingCount = profile.avg_rating?.[0]?.rating_count || 0;

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
        <div className="flex items-center mb-6">
          {profile.avatar_url && (
            <img src={profile.avatar_url} alt={`${profile.full_name}'s avatar`} className="w-24 h-24 rounded-full mr-6" />
          )}
          <div>
            <h1 className="text-3xl font-bold">{profile.full_name}</h1>
            {profile.verified && (
              <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full ml-1">
                Verified Instructor
              </span>
            )}
            {profile.website && (
              <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline block">
                {profile.website}
              </a>
            )}
          </div>
        </div>
        
        <div>
          <h2 className="text-xl font-bold border-b pb-2 mb-4">Instructor Details</h2>
          {profile.verified && (
            <VerificationStatus />
          )}
          
          <div className="mt-8">
            <h2 className="text-xl font-bold border-b pb-2 mb-4">Ratings</h2>
            <div className="mb-6">
              <p className="text-lg font-semibold">
                Average Rating: {avgRating.toFixed(1)} / 5
                <span className="text-sm text-gray-500 ml-2">({ratingCount} reviews)</span>
              </p>
            </div>
            
            {(profile.ratings && profile.ratings.length > 0) ? (
              <ul className="space-y-4">
                {profile.ratings.map((rating: any) => (
                  <li key={rating.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center mb-1">
                      <p className="font-bold">{rating.company.full_name}</p>
                      <p className="text-sm text-gray-500">{'⭐'.repeat(Math.round(rating.score))}</p>
                    </div>
                    {rating.feedback && (
                      <p className="text-gray-700">{rating.feedback}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(rating.created_at).toLocaleDateString()}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No ratings yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
