'use client';

import Link from 'next/link';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('instructor');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role: role,
        },
      },
    });

    if (error) {
      setError(error.message);
    } else {
      // On successful sign-up, Supabase sends a confirmation email.
      // You can redirect the user to a page that tells them to check their email.
      router.push('/confirm-email');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center">Create an account</h2>
        <form onSubmit={handleSignUp} className="mt-8 space-y-6">
          <div>
            <label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <fieldset className="pt-4">
            <legend className="text-sm font-medium text-gray-900">I am a...</legend>
            <div className="flex items-center gap-8 mt-2">
              <div className="flex items-center">
                <input
                  id="role-instructor"
                  name="role"
                  type="radio"
                  value="instructor"
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  checked={role === 'instructor'}
                  onChange={(e) => setRole(e.target.value)}
                />
                <label htmlFor="role-instructor" className="block ml-3 text-sm text-gray-700">
                  Instructor
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="role-company"
                  name="role"
                  type="radio"
                  value="company"
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  checked={role === 'company'}
                  onChange={(e) => setRole(e.target.value)}
                />
                <label htmlFor="role-company" className="block ml-3 text-sm text-gray-700">
                  Company
                </label>
              </div>
            </div>
          </fieldset>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Sign up
            </button>
          </div>
        </form>
        <p className="text-sm text-center text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

