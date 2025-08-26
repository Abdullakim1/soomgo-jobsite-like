import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import Notifications from './Notifications';

export default async function Header() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <header className="w-full bg-white shadow-md fixed top-0 left-0 z-50">
      <nav className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="text-xl font-semibold text-gray-700">
              <Link href="/">
                Soomgo Clone
              </Link>
            </div>
            <Link href="/jobs" className="text-gray-700 hover:text-blue-600">
              Find Jobs
            </Link>
          </div>
          <div>
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-gray-700">{user.email}</span>
                <Notifications user={user} />
                <Link href="/dashboard" className="px-4 py-2 text-gray-700">
                  Dashboard
                </Link>
                <form action="/auth/sign-out" method="post">
                  <button type="submit" className="px-4 py-2 text-white bg-red-600 rounded-md">
                    Logout
                  </button>
                </form>
              </div>
            ) : (
              <>
                <Link href="/login" className="px-4 py-2 text-gray-700">
                  Login
                </Link>
                <Link href="/signup" className="px-4 py-2 text-white bg-blue-600 rounded-md">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
