import { Button } from '@/components/ui/button';
import { Clapperboard, Music, Sparkles, Tv } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="relative flex h-screen w-full items-center justify-center">
      <Image
        src="https://placehold.co/1920x1080.png"
        alt="Friends watching a movie together on a couch"
        fill
        className="object-cover"
        data-ai-hint="friends watching movie"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
      <main className="relative z-10 flex flex-col items-center justify-center p-4 text-center text-white">
        <div className="flex flex-col items-center justify-center">
          <Clapperboard className="h-16 w-16 text-primary mb-4" />
          <h1 className="text-5xl font-headline font-bold text-foreground drop-shadow-lg">
            CineSync
          </h1>
          <p className="text-muted-foreground mt-2 text-lg drop-shadow-md">
            Your place for synchronized movie nights and shared music sessions, from anywhere.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-12">
            <Button asChild size="lg">
              <Link href="/schedule">
                <Tv className="mr-2" />
                Create a Watch Party
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
                <Link href="/music">
                    <Music className="mr-2"/>
                    Start a Music Session
                </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="bg-background/20 border-white/20 hover:bg-white/10">
              <Link href="/recommend">
                <Sparkles className="mr-2" />
                Get Movie Ideas
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
