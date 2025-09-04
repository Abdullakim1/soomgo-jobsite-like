import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Sparkles, LogIn, ArrowRight } from 'lucide-react';

const Header = () => {
  return (
    <header className="border-b bg-background/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3 group">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">Soomgo</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <Link 
              href="/jobs" 
              className="text-muted-foreground hover:text-primary transition-colors duration-200"
            >
              Browse Jobs
            </Link>
            <Link 
              href="/how-it-works" 
              className="text-muted-foreground hover:text-primary transition-colors duration-200"
            >
              How It Works
            </Link>
            <Link 
              href="/become-a-provider" 
              className="text-muted-foreground hover:text-primary transition-colors duration-200"
            >
              Become a Provider
            </Link>
          </nav>
        </div>
        
        <div className="flex items-center gap-2">
                    <Button variant="ghost" className="flex items-center gap-2">
            <LogIn className="h-4 w-4" />
            Sign In
          </Button>
          <Button className="rounded-full flex items-center gap-2">
            Get Started
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}

export default Header;
