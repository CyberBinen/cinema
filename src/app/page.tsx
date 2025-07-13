import { Button } from '@/components/ui/button';
import { Clapperboard, Sparkles, Tv } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex h-screen w-full bg-slate-800" style={{backgroundColor: "hsl(0, 0%, 20%)"}}>
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center justify-center text-center">
            <Clapperboard className="w-16 h-16 text-primary mb-4" />
            <h1 className="text-5xl font-headline font-bold text-foreground">
            CineSync
            </h1>
            <p className="text-muted-foreground mt-2 text-lg">Your place for synchronized movie nights, from anywhere.</p>

            <div className="flex flex-col sm:flex-row gap-4 mt-12">
                <Button asChild size="lg">
                    <Link href="/schedule">
                        <Tv className="mr-2"/>
                        Create a Watch Party
                    </Link>
                </Button>
                <Button asChild variant="secondary" size="lg">
                    <Link href="/recommend">
                        <Sparkles className="mr-2"/>
                        Get a Movie Recommendation
                    </Link>
                </Button>
            </div>
        </div>
      </main>
    </div>
  );
}
