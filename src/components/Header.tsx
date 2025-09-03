import Link from 'next/link';

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="text-xl font-bold text-slate-900">
          InstructorMatch
        </Link>
        
        <nav className="flex items-center gap-6">
          <Link 
            href="/jobs" 
            className="text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            Browse Jobs
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/signin"
              className="rounded-md px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Get Started
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
