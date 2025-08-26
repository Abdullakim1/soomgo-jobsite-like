import type { Metadata } from 'next';
import Header from '@/components/Header';
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
      <body className="bg-gray-100 text-gray-900">
        <Header />
        <main className="min-h-screen flex flex-col items-center pt-16">
          {children}
        </main>
      </body>
    </html>
  );
}


