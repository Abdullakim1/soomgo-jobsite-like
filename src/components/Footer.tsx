import Link from 'next/link';
import { Facebook, Instagram, Youtube, MessageSquare } from 'lucide-react';

const footerLinks = [
  {
    title: 'About Soomgo',
    links: [
      { name: 'Company Info', href: '#' },
      { name: 'Careers', href: '#' },
      { name: 'Press', href: '#' },
    ],
  },
  {
    title: 'For Customers',
    links: [
      { name: 'Find a Pro', href: '/find-pro' },
      { name: 'How It Works', href: '#' },
      { name: 'Customer Center', href: '#' },
    ],
  },
  {
    title: 'For Pros',
    links: [
      { name: 'Become a Pro', href: '#' },
      { name: 'Pro Center', href: '#' },
      { name: 'Pro Blog', href: '#' },
    ],
  },
];

const socialLinks = [
  { icon: Facebook, href: '#', name: 'Facebook' },
  { icon: Instagram, href: '#', name: 'Instagram' },
  { icon: Youtube, href: '#', name: 'YouTube' },
  { icon: MessageSquare, href: '#', name: 'Blog' },
];

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-8">
          <div className="col-span-2 lg:col-span-1">
            <h3 className="font-bold text-lg mb-2">Customer Center</h3>
            <p className="text-2xl font-bold">1599-5319</p>
            <p className="text-sm text-muted-foreground">Weekdays 10:00 - 18:00</p>
          </div>
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold text-foreground mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-muted-foreground hover:text-primary transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t pt-8 flex flex-col sm:flex-row justify-between items-center">
          <div className="text-sm text-muted-foreground mb-4 sm:mb-0">
            <p>&copy; {new Date().getFullYear()} Soomgo Inc. All rights reserved.</p>
            <div className="flex gap-4 mt-2">
              <Link href="#" className="hover:text-primary">Terms of Service</Link>
              <Link href="#" className="hover:text-primary">Privacy Policy</Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <Link href={social.href} key={social.name} className="text-muted-foreground hover:text-primary">
                <social.icon className="h-6 w-6" />
                <span className="sr-only">{social.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
