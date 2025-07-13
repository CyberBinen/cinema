'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function ScheduleForm() {
  const router = useRouter();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const movieTitle = formData.get('movieTitle') as string;
    // In a real app, you would save this to a database and get a unique ID.
    // For this prototype, we'll generate a random-ish ID.
    const partyId = Math.random().toString(36).substring(2, 9);
    
    // We'll store the title in localStorage to pass it to the watch page.
    localStorage.setItem(`party-${partyId}-title`, movieTitle);
    
    router.push(`/watch/${partyId}`);
  };

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Create Watch Party</CardTitle>
          <CardDescription>Give your party a name and schedule it.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="movieTitle">Movie Title</Label>
            <Input id="movieTitle" name="movieTitle" placeholder="e.g., The Matrix" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="scheduleTime">Date & Time</Label>
            <Input id="scheduleTime" name="scheduleTime" type="datetime-local" required />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">
            Create Party & Get Invite Link
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
