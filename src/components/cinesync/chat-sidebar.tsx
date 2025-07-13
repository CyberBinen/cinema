'use client';

import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Clapperboard, Send, Users } from 'lucide-react';

const mockMessages = [
  {
    user: 'Alex',
    avatar: 'https://placehold.co/40x40.png',
    aiHint: 'man face',
    text: 'This opening scene is iconic!',
    time: '5:01 PM',
  },
  {
    user: 'Maria',
    avatar: 'https://placehold.co/40x40.png',
    aiHint: 'woman face',
    text: 'I know, right? The cinematography is breathtaking. 😮',
    time: '5:02 PM',
  },
  {
    user: 'David',
    avatar: 'https://placehold.co/40x40.png',
    aiHint: 'person face',
    text: 'Just joined! Did I miss anything important?',
    time: '5:03 PM',
  },
  {
    user: 'You',
    avatar: 'https://placehold.co/40x40.png',
    aiHint: 'user icon',
    text: "Not much, just the beginning. Welcome! Grab some popcorn. 🍿",
    time: '5:03 PM',
    isYou: true,
  },
  {
    user: 'Chloe',
    avatar: 'https://placehold.co/40x40.png',
    aiHint: 'woman face',
    text: 'The sound design is incredible. I have my headphones on.',
    time: '5:05 PM',
  },
  {
    user: 'Alex',
    avatar: 'https://placehold.co/40x40.png',
    aiHint: 'man face',
    text: 'Haha, classic line coming up!',
    time: '5:07 PM',
  },
];


export default function ChatSidebar() {
  return (
    <aside className="w-full md:w-80 lg:w-96 bg-card flex flex-col h-screen border-l border-border">
      <header className="p-4 flex flex-col gap-2 items-center justify-center border-b">
        <div className="flex items-center gap-2">
          <Clapperboard className="w-7 h-7 text-primary" />
          <h1 className="text-2xl font-headline font-bold text-foreground">
            CineSync
          </h1>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users size={16} />
            <span>14 Viewers</span>
        </div>
      </header>
      
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-6">
          {mockMessages.map((msg, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 ${
                msg.isYou ? 'flex-row-reverse' : ''
              }`}
            >
              <Avatar className="w-8 h-8">
                <AvatarImage src={msg.avatar} data-ai-hint={msg.aiHint} />
                <AvatarFallback>{msg.user.charAt(0)}</AvatarFallback>
              </Avatar>
              <div
                className={`flex flex-col ${
                  msg.isYou ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`rounded-lg px-3 py-2 max-w-xs ${
                    msg.isYou
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground'
                  }`}
                >
                  <p className="text-sm font-bold">{msg.user}</p>
                  <p className="text-sm">{msg.text}</p>
                </div>
                 <span className="text-xs text-muted-foreground mt-1">{msg.time}</span>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      
      <Separator />

      <footer className="p-4">
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="relative">
            <Input
              placeholder="Say something..."
              className="pr-12"
            />
            <Button
              type="submit"
              size="icon"
              variant="ghost"
              className="absolute top-1/2 right-1 -translate-y-1/2 h-8 w-8 text-accent hover:text-accent"
            >
              <Send size={20} />
            </Button>
          </div>
        </form>
      </footer>
    </aside>
  );
}
