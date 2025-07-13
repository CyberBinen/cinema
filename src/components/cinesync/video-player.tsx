'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Settings,
  ShieldCheck,
  Signal,
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export default function VideoPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  return (
    <TooltipProvider>
      <div className="relative w-full aspect-video bg-black rounded-lg shadow-2xl overflow-hidden group">
        <Image
          src="https://placehold.co/1920x1080/000000/ffffff.png"
          alt="Movie placeholder"
          layout="fill"
          objectFit="cover"
          data-ai-hint="cinema screen"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
        
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
           <h2 className="text-lg font-headline text-white drop-shadow-lg">Movie Title: A Space Odyssey</h2>
           <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs text-green-400">
              <ShieldCheck size={16} />
              <span className="font-medium">Encrypted Stream</span>
            </div>
             <div className="flex items-center gap-2 text-xs text-cyan-400">
              <Signal size={16} />
              <span className="font-medium">Adaptive Quality</span>
            </div>
           </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 z-10 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex items-center gap-2 mb-2">
            <div className="text-white text-sm font-mono">1:02:34</div>
            <Slider defaultValue={[45]} max={100} step={1} className="w-full" />
            <div className="text-white text-sm font-mono">2:19:00</div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/10 hover:text-white"
                    onClick={() => setIsPlaying(!isPlaying)}
                  >
                    {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isPlaying ? 'Pause' : 'Play'}</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/10 hover:text-white"
                    onClick={() => setIsMuted(!isMuted)}
                  >
                    {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isMuted ? 'Unmute' : 'Mute'}</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/10 hover:text-white"
                  >
                    <Settings size={20} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Settings</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/10 hover:text-white"
                    onClick={() => setIsFullscreen(!isFullscreen)}
                  >
                    {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
