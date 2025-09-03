import Link from 'next/link';

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-6 text-2xl font-bold text-slate-900">Sign In</h1>
        
        <form className="space-y-6">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              placeholder="your@email.com"
              required
            />
          </div>
          
          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-slate-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              placeholder="••••••••"
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Sign In
          </button>
        </form>
        
        <div className="mt-6 text-center text-sm text-slate-600">
          Don't have an account?{' '}
          <Link href="/signup" className="font-medium text-blue-600 hover:text-blue-500">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
