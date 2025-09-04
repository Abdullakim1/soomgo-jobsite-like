import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-slate-100 py-8">
      <div className="container flex flex-col items-center justify-between gap-6 sm:flex-row">
        <p className="text-sm text-slate-500">
          &copy; {new Date().getFullYear()} InstructorMatch. All rights reserved.
        </p>
        <nav className="flex gap-6">
          <Link href="/about" className="text-sm text-slate-500 hover:text-slate-900">
            About
          </Link>
          <Link href="/contact" className="text-sm text-slate-500 hover:text-slate-900">
            Contact
          </Link>
          <Link href="/privacy" className="text-sm text-slate-500 hover:text-slate-900">
            Privacy Policy
          </Link>
        </nav>
      </div>
    </footer>
  );
}
