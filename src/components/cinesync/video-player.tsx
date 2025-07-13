'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
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
  Link as LinkIcon,
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import { getDiscussionStarters } from '@/app/actions';

function formatTime(seconds: number) {
    if (isNaN(seconds)) return '00:00';
    const date = new Date(seconds * 1000);
    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes().toString().padStart(2, '0');
    const ss = date.getUTCSeconds().toString().padStart(2, '0');
    if (hh) {
        return `${hh}:${mm}:${ss}`;
    }
    return `${mm}:${ss}`;
}


interface VideoPlayerProps {
  movieTitle?: string;
}

interface Reaction {
    id: number;
    emoji: string;
}

export default function VideoPlayer({ movieTitle: scheduledTitle }: VideoPlayerProps) {
  const { toast } = useToast();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [videoTitle, setVideoTitle] = useState('Movie Title');
  const [reactions, setReactions] = useState<Reaction[]>([]);
  let reactionId = 0;

  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDiscussionStart = useCallback(async (title: string) => {
    const result = await getDiscussionStarters({ movieTitle: title });
    if (result.questions) {
      const event = new CustomEvent('discussion-starters', { detail: result.questions });
      window.dispatchEvent(event);
    } else if (result.error) {
      toast({
        variant: 'destructive',
        title: 'Could not generate discussion starters',
        description: result.error,
      });
    }
  }, [toast]);

  useEffect(() => {
    const handleNewReaction = (event: Event) => {
        const customEvent = event as CustomEvent<string>;
        const newReaction: Reaction = { id: reactionId++, emoji: customEvent.detail };
        setReactions(prev => [...prev, newReaction]);
        setTimeout(() => {
            setReactions(prev => prev.filter(r => r.id !== newReaction.id));
        }, 3000);
    };

    window.addEventListener('emoji-reaction', handleNewReaction);
    return () => {
        window.removeEventListener('emoji-reaction', handleNewReaction);
    }
  }, []);

  useEffect(() => {
    const partyTitle = localStorage.getItem(`party-${scheduledTitle?.split(' ').pop()}-title`);
    if (partyTitle) {
      setVideoTitle(partyTitle);
    } else if (scheduledTitle) {
      setVideoTitle(scheduledTitle);
    }
  }, [scheduledTitle]);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
      const handleLoadedMetadata = () => {
        setDuration(videoElement.duration);
      };
      const handleTimeUpdate = () => {
        setCurrentTime(videoElement.currentTime);
      };
      const handleEnded = () => {
        if (videoTitle && videoTitle !== 'Screen Share' && videoTitle !== 'Movie Title') {
          handleDiscussionStart(videoTitle);
        }
      }

      videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);
      videoElement.addEventListener('timeupdate', handleTimeUpdate);
      videoElement.addEventListener('ended', handleEnded);

      if (stream) {
        videoElement.srcObject = stream;
        videoElement.play();
        setIsPlaying(true);
      }
      
      return () => {
          videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
          videoElement.removeEventListener('timeupdate', handleTimeUpdate);
          videoElement.removeEventListener('ended', handleEnded);
      }
    }
  }, [stream, videoTitle, handleDiscussionStart]);


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
    const videoContainer = videoRef.current?.parentElement;
    if (!videoContainer) return;

    if (!document.fullscreenElement) {
        videoContainer.requestFullscreen().catch(err => {
          toast({
            variant: 'destructive',
            title: 'Fullscreen Error',
            description: 'Could not enter fullscreen mode. Your browser might not support it or it might be disabled.',
          });
        });
        setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      setVideoSrc(url);
      setVideoTitle(file.name);
      setIsPlaying(false);
    }
  };
  
  const handleSliderChange = (value: number[]) => {
      if (videoRef.current) {
          videoRef.current.currentTime = value[0];
          setCurrentTime(value[0]);
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
      if (videoSrc) {
        URL.revokeObjectURL(videoSrc);
        setVideoSrc(null);
      }
      setStream(screenStream);
      setVideoTitle('Screen Share');
      
      screenStream.getVideoTracks()[0].addEventListener('ended', () => {
        setStream(null);
        setIsPlaying(false);
      });
    } catch (error: any) {
        if (error.name === 'NotAllowedError') {
             toast({
                variant: 'destructive',
                title: 'Permission Denied',
                description: 'You denied the request to share your screen.',
            });
        } else if (error.name === 'SecurityError' || error.name === 'NotAllowedError') {
            toast({
                variant: 'destructive',
                title: 'Permission Policy Error',
                description: 'Screen sharing is not allowed by the current security policy. This may happen in embedded environments like this one.',
            });
        } else {
            toast({
                variant: 'destructive',
                title: 'Screen Share Error',
                description: 'Could not start screen sharing. Please try again.',
            });
        }
      console.error('Error sharing screen:', error);
    }
  };
  
  const handleInvite = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
        title: 'Invite Link Copied!',
        description: 'The link to this watch party has been copied to your clipboard.',
    })
  };

  return (
    <TooltipProvider>
      <div className="relative w-full aspect-video bg-black rounded-lg shadow-2xl overflow-hidden group">
        <video
          ref={videoRef}
          src={videoSrc || undefined}
          className={`w-full h-full object-contain ${!videoSrc && !stream ? 'hidden' : ''}`}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onVolumeChange={(e) => setIsMuted((e.target as HTMLVideoElement).muted)}
          controls={false}
          onClick={handlePlayPause}
        />

        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {reactions.map(r => (
                <div key={r.id} className="absolute text-5xl animate-float-up"
                    style={{
                        left: `${Math.random() * 80 + 10}%`,
                        bottom: '-50px',
                        animationDuration: `${Math.random() * 2 + 2}s`
                    }}
                >{r.emoji}</div>
            ))}
        </div>

        {!videoSrc && !stream && (
          <>
            <Image
              src="https://placehold.co/1920x1080.png"
              alt="Movie placeholder"
              fill
              className="object-cover"
              data-ai-hint="cinema screen"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 z-20">
              <h3 className="text-2xl font-bold text-white mb-6">Host controls</h3>
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

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 pointer-events-none" />
        
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
           <h2 className="text-lg font-headline text-white drop-shadow-lg truncate max-w-sm">{videoTitle}</h2>
           <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={handleInvite} className="text-white hover:bg-white/10 hover:text-white">
                <LinkIcon className="mr-2"/>
                Invite
            </Button>
            <div className="flex items-center gap-2 text-xs text-green-400">
              <ShieldCheck size={16} />
              <span className="font-medium">Host</span>
            </div>
             <div className="flex items-center gap-2 text-xs text-cyan-400">
              <Signal size={16} />
              <span className="font-medium">Good</span>
            </div>
           </div>
        </div>

        {(videoSrc || stream) && (
            <div className="absolute bottom-0 left-0 right-0 p-4 z-10 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex items-center gap-4 mb-2">
                <div className="text-white text-sm font-mono">{formatTime(currentTime)}</div>
                <Slider value={[currentTime]} max={duration} step={1} className="w-full" onValueChange={handleSliderChange} />
                <div className="text-white text-sm font-mono">{formatTime(duration)}</div>
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
