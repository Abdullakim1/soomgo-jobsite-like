import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Music, Briefcase, PenTool, Heart, Search, Users, CheckCircle } from 'lucide-react';

const categories = [
  { name: 'Music', icon: Music, href: '/jobs?category=music' },
  { name: 'Business', icon: Briefcase, href: '/jobs?category=business' },
  { name: 'Design', icon: PenTool, href: '/jobs?category=design' },
  { name: 'Fitness', icon: Heart, href: '/jobs?category=fitness' },
];

const howItWorksSteps = [
  {
    icon: Search,
    title: 'Find an Instructor',
    description: 'Search for the service you need and browse through our talented instructors.',
  },
  {
    icon: Users,
    title: 'Get Matched',
    description: 'Answer a few questions and get matched with the right instructors for your job.',
  },
  {
    icon: CheckCircle,
    title: 'Hire with Confidence',
    description: 'Review profiles, ratings, and verifications before making a hiring decision.',
  },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[hsl(var(--background))]">
      {/* Hero Section */}
            <section className="pt-20 pb-12 md:pt-28 md:pb-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Find the Perfect Professional for Your Project</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">Connect with skilled instructors and service providers in your area.</p>
          <div className="max-w-xl mx-auto flex flex-col sm:flex-row gap-4 justify-center">
                        <Input 
              placeholder="What service do you need?" 
              className="bg-primary-foreground/90 text-primary border-transparent focus:ring-2 focus:ring-primary-foreground/50"
            />
                        <Button variant="secondary" className="bg-green-500 hover:bg-green-600">Get Quotes</Button>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16 bg-[hsl(var(--background))]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-[hsl(var(--foreground))]">Popular Service Categories</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category) => (
              <Link key={category.name} href={category.href}>
                                                <Card key={category.name} className="flex flex-col h-full text-center items-center pt-6">
                  <CardHeader>
                    <category.icon className="w-10 h-10 text-primary" />
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <CardTitle>{category.name}</CardTitle>
                    <CardDescription className="mt-2">{category.name} services</CardDescription>
                  </CardContent>
                  <CardFooter>
                    <Button variant="link">Find Providers →</Button>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
          <div className="mt-12 text-center">
                        <Button variant="outline">View All Categories</Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
            <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-[hsl(var(--foreground))]">How Soomgo Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {howItWorksSteps.map((item, index) => (
                            <div key={index} className="flex flex-col items-center text-center p-6 bg-card rounded-lg shadow-sm transition-transform duration-300 hover:scale-105">
                <item.icon className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-[hsl(var(--foreground))]">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
            <section className="py-16 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">Join thousands of satisfied customers who found the right professionals for their projects.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button variant="secondary" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">Request a Service</Button>
                        <Button variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10">Become a Provider</Button>
          </div>
        </div>
      </section>

      
    </div>
  )
}
