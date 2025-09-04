import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from 'lucide-react';

const Header = () => {
  return (
    <header className="border-b bg-background sticky top-0 z-50">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-primary">Soomgo</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="/find-pro" className="text-foreground hover:text-primary transition-colors">
              Find a Pro
            </Link>
            <Link href="/market" className="text-foreground hover:text-primary transition-colors">
              Market
            </Link>
            <Link href="/community" className="text-foreground hover:text-primary transition-colors">
              Community
            </Link>
          </nav>
        </div>

        <div className="hidden lg:flex flex-grow max-w-md relative mx-8">
          <Input
            type="search"
            placeholder="What service do you need?"
            className="pl-10 h-12 w-full rounded-full bg-muted border-transparent focus:bg-background focus:border-primary"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" className="hidden sm:inline-flex">Become a Pro</Button>
          <Button>Login</Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
