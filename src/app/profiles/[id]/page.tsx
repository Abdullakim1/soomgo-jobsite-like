import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';

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
      reviews:reviews!instructor_id(id, rating, comment, created_at, company:profiles!company_id(full_name))
    `)
    .eq('id', profileId)
    .single();

  if (error || !profile || profile.role !== 'instructor') {
    notFound();
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
        <div className="flex items-center mb-6">
          {profile.avatar_url && (
            <img src={profile.avatar_url} alt={`${profile.full_name}'s avatar`} className="w-24 h-24 rounded-full mr-6" />
          )}
          <div>
            <h1 className="text-3xl font-bold">{profile.full_name}</h1>
            {profile.website && (
              <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                {profile.website}
              </a>
            )}
          </div>
        </div>
        <div>
          <h2 className="text-xl font-bold border-b pb-2 mb-4">Profile Details</h2>
          <p><span className="font-semibold">Role:</span> <span className="capitalize">{profile.role}</span></p>
          {/* More profile details can be added here in the future */}

          <div className="mt-8">
            <h2 className="text-xl font-bold border-b pb-2 mb-4">Reviews</h2>
            {(profile.reviews && profile.reviews.length > 0) ? (
              <div>
                <div className="mb-4">
                  <p className="text-lg font-semibold">Average Rating: { (profile.reviews.reduce((acc, review) => acc + review.rating, 0) / profile.reviews.length).toFixed(1) } / 5</p>
                </div>
                <ul className="space-y-4">
                  {profile.reviews.map((review: any) => (
                    <li key={review.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-center mb-1">
                        <p className="font-bold">{review.company.full_name}</p>
                        <p className="text-sm text-gray-500">{'⭐'.repeat(review.rating)}</p>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                      <p className="text-xs text-gray-400 mt-2">{new Date(review.created_at).toLocaleDateString()}</p>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p>No reviews yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
