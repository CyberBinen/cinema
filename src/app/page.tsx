import ScheduleForm from '@/components/cinesync/schedule-form';
import { Button } from '@/components/ui/button';
import { Clapperboard, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex h-screen w-full bg-slate-800" style={{backgroundColor: "hsl(0, 0%, 20%)"}}>
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md mx-auto">
           <div className="flex flex-col items-center justify-center mb-8">
              <Clapperboard className="w-12 h-12 text-primary mb-4" />
              <h1 className="text-4xl font-headline font-bold text-foreground">
                CineSync
              </h1>
              <p className="text-muted-foreground">Schedule your next watch party.</p>
           </div>
          <ScheduleForm />
           <div className="mt-8 text-center">
              <Button variant="ghost" asChild>
                <Link href="/recommend">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Looking for something to watch? Get a recommendation
                </Link>
              </Button>
            </div>
        </div>
      </main>
    </div>
  );
}
