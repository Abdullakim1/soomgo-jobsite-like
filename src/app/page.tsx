import Link from 'next/link';
import { Card, CardTitle } from "@/components/ui/card";
import { 
  Truck, Wrench, Paintbrush, Briefcase, PartyPopper, 
  BookOpen, Palette, Dumbbell, Car, Landmark, Menu 
} from 'lucide-react';

const serviceCategories = [
  { name: 'Moving/Cleaning', icon: Truck, href: '/services/moving-cleaning' },
  { name: 'Installation/Repair', icon: Wrench, href: '/services/installation-repair' },
  { name: 'Interior Design', icon: Paintbrush, href: '/services/interior-design' },
  { name: 'Freelance', icon: Briefcase, href: '/services/freelance' },
  { name: 'Events/Beauty', icon: PartyPopper, href: '/services/events-beauty' },
  { name: 'Tutoring', icon: BookOpen, href: '/services/tutoring' },
  { name: 'Hobbies', icon: Palette, href: '/services/hobbies' },
  { name: 'Fitness', icon: Dumbbell, href: '/services/fitness' },
  { name: 'Automotive', icon: Car, href: '/services/automotive' },
  { name: 'Legal/Finance', icon: Landmark, href: '/services/legal-finance' },
  { name: 'All Services', icon: Menu, href: '/services' },
];

export default function Home() {
  return (
    <main className="bg-background">
      <div className="container mx-auto px-4 py-12">
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Find the help you need for a better life.
          </h1>
          <p className="text-lg text-muted-foreground">Soomgo - The technology of life</p>
        </section>

        <section>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {serviceCategories.map((category) => (
              <Link href={category.href} key={category.name}>
                <Card className="group flex flex-col items-center justify-center text-center p-4 h-32 rounded-lg transition-all duration-300 hover:bg-primary/5 hover:shadow-lg">
                  <category.icon className="h-8 w-8 mb-2 text-muted-foreground group-hover:text-primary transition-colors" />
                  <CardTitle className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                    {category.name}
                  </CardTitle>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
