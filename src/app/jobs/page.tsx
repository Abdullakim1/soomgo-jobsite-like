import Link from 'next/link';

export default function JobsPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Available Jobs</h1>
        <Link 
          href="/jobs/new" 
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Post a Job
        </Link>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Sample job cards - replace with real data */}
        {[1, 2, 3].map((job) => (
          <div key={job} className="rounded-lg border bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold">Math Tutoring for High School Student</h2>
            <div className="mt-2 flex items-center gap-2 text-sm text-slate-600">
              <span>Budget: $50-$80/hr</span>
              <span>•</span>
              <span>3 days ago</span>
            </div>
            <p className="mt-4 line-clamp-2 text-sm text-slate-600">
              Looking for an experienced math tutor to help my daughter with algebra and geometry. 
              Must be available weekday evenings.
            </p>
            <Link 
              href={`/jobs/${job}`} 
              className="mt-4 inline-block text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              View details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
