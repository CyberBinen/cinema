'use client';

import React, { useState, useRef } from 'react';
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
  ScreenShare,
  Upload,
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
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoRef.current?.parentElement?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setStream(null);
      setVideoSrc(url);
      setIsPlaying(false);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleScreenShare = async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });
      setVideoSrc(null);
      setStream(screenStream);
      if (videoRef.current) {
        videoRef.current.srcObject = screenStream;
        videoRef.current.play();
        setIsPlaying(true);
      }
      screenStream.getVideoTracks()[0].addEventListener('ended', () => {
        setStream(null);
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
        setIsPlaying(false);
      });
    } catch (error) {
      console.error('Error sharing screen:', error);
    }
  };

  return (
    <TooltipProvider>
      <div className="relative w-full aspect-video bg-black rounded-lg shadow-2xl overflow-hidden group">
        <video
          ref={videoRef}
          src={videoSrc || ''}
          className={`w-full h-full object-contain ${!videoSrc && !stream ? 'hidden' : ''}`}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onVolumeChange={(e) => setIsMuted((e.target as HTMLVideoElement).muted)}
        />

        {!videoSrc && !stream && (
          <>
            <Image
              src="https://placehold.co/1920x1080/000000/ffffff.png"
              alt="Movie placeholder"
              layout="fill"
              objectFit="cover"
              data-ai-hint="cinema screen"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 z-20">
              <h3 className="text-2xl font-bold text-white mb-6">Start a watch party</h3>
              <div className="flex gap-4">
                <Button onClick={handleScreenShare} size="lg">
                  <ScreenShare className="mr-2" /> Share Your Screen
                </Button>
                <Button onClick={handleUploadClick} variant="secondary" size="lg">
                  <Upload className="mr-2" /> Upload a Movie
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept="video/*"
                />
              </div>
            </div>
          </>
        )}

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

        {(videoSrc || stream) && (
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
                        onClick={handlePlayPause}
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
                        onClick={handleMute}
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
                            onClick={handleScreenShare}
                        >
                            <ScreenShare size={20} />
                        </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                        <p>Share Screen</p>
                        </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-white hover:bg-white/10 hover:text-white"
                            onClick={handleUploadClick}
                        >
                            <Upload size={20} />
                        </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                        <p>Upload Movie</p>
                        </TooltipContent>
                    </Tooltip>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept="video/*"
                    />
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
                        onClick={handleFullscreen}
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
        )}
      </div>
    </TooltipProvider>
  );
}
