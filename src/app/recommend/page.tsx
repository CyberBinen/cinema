'use client';

import React, { useActionState } from 'react';
import RecommendationForm from '@/components/cinesync/recommendation-form';
import RecommendationResult from '@/components/cinesync/recommendation-result';
import type { RecommendFilmOutput } from '@/ai/flows/recommend-film';
import { getFilmRecommendation } from '@/app/actions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Clapperboard, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function RecommendPage() {
  const initialState = { message: "", recommendation: undefined, error: undefined };
  const [state, formAction] = useActionState(getFilmRecommendation, initialState);

  return (
    <div className="flex min-h-screen w-full bg-slate-800" style={{backgroundColor: "hsl(0, 0%, 20%)"}}>
       <main className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-5xl mx-auto">
            <Button variant="ghost" asChild className="mb-4">
                <Link href="/">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Home
                </Link>
            </Button>
            <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                <Clapperboard className="w-8 h-8 text-accent" />
                <div>
                    <CardTitle className="font-headline text-2xl">Find Your Next Movie</CardTitle>
                    <CardDescription>Let our AI recommend a film based on your tastes.</CardDescription>
                </div>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-8">
                    <RecommendationForm formAction={formAction} />
                    <RecommendationResult result={state.recommendation} />
                </CardContent>
            </Card>
        </div>
      </main>
    </div>
  );
}
