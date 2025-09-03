import type { Metadata } from 'next';
import { Header } from '@/components/Header';
import './globals.css';

export const metadata: Metadata = {
  title: 'Soomgo Clone',
  description: 'A platform to connect instructors and companies.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50">
        <Header />
        <main className="container py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
