'use client';

import React, { useActionState } from 'react';
import VideoPlayer from '@/components/cinesync/video-player';
import RecommendationForm from '@/components/cinesync/recommendation-form';
import RecommendationResult from '@/components/cinesync/recommendation-result';
import type { RecommendFilmOutput } from '@/ai/flows/recommend-film';
import { getFilmRecommendation } from '@/app/actions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Clapperboard } from 'lucide-react';

interface MainViewProps {
  movieTitle?: string;
}

export default function MainView({ movieTitle }: MainViewProps) {
  const initialState = { message: "", recommendation: undefined, error: undefined };
  const [state, formAction] = useActionState(getFilmRecommendation, initialState);

  return (
    <div className="flex-1 p-4 md:p-6 lg:p-8 flex flex-col gap-8">
      <VideoPlayer movieTitle={movieTitle} />
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
  );
}
