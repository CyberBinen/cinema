'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Upload,
  Play,
  Pause,
  StepForward,
  StepBack,
  Volume2,
  VolumeX,
  ListMusic,
  Link as LinkIcon,
} from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Track {
  file: File;
  name: string;
  url: string;
}

function formatTime(seconds: number) {
    if (isNaN(seconds)) return '00:00';
    const date = new Date(seconds * 1000);
    const mm = date.getUTCMinutes().toString().padStart(2, '0');
    const ss = date.getUTCSeconds().toString().padStart(2, '0');
    return `${mm}:${ss}`;
}

export function MusicPlayer() {
  const [playlist, setPlaylist] = useState<Track[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const currentTrack = currentTrackIndex !== null ? playlist[currentTrackIndex] : null;

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const updateCurrentTime = () => setCurrentTime(audio.currentTime);
      const updateDuration = () => setDuration(audio.duration);
      const handleTrackEnd = () => handleNext();

      audio.addEventListener('timeupdate', updateCurrentTime);
      audio.addEventListener('loadedmetadata', updateDuration);
      audio.addEventListener('ended', handleTrackEnd);

      return () => {
        audio.removeEventListener('timeupdate', updateCurrentTime);
        audio.removeEventListener('loadedmetadata', updateDuration);
        audio.removeEventListener('ended', handleTrackEnd);
      };
    }
  }, [currentTrackIndex, playlist]);
  
  useEffect(() => {
    if (audioRef.current && currentTrack) {
        audioRef.current.src = currentTrack.url;
        audioRef.current.play().then(() => setIsPlaying(true)).catch(e => console.error("Playback failed", e));
    }
  }, [currentTrack]);


  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newTracks: Track[] = Array.from(files).map(file => ({
        file,
        name: file.name,
        url: URL.createObjectURL(file),
      }));
      setPlaylist(prev => [...prev, ...newTracks]);
      if (currentTrackIndex === null) {
        setCurrentTrackIndex(0);
      }
      toast({
          title: `${newTracks.length} song(s) added to the playlist!`,
      })
    }
  };

  const handlePlayPause = () => {
    if (!audioRef.current || currentTrackIndex === null) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    if (currentTrackIndex === null || playlist.length === 0) return;
    const nextIndex = (currentTrackIndex + 1) % playlist.length;
    setCurrentTrackIndex(nextIndex);
  };

  const handlePrev = () => {
    if (currentTrackIndex === null || playlist.length === 0) return;
    const prevIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
    setCurrentTrackIndex(prevIndex);
  };
  
  const handleSeek = (value: number[]) => {
      if(audioRef.current) {
          audioRef.current.currentTime = value[0];
          setCurrentTime(value[0]);
      }
  }
  
  const handleMute = () => {
      if(audioRef.current) {
          audioRef.current.muted = !isMuted;
          setIsMuted(!isMuted);
      }
  }
  
  const selectTrack = (index: number) => {
      setCurrentTrackIndex(index);
  }

  const handleInvite = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
        title: 'Invite Link Copied!',
        description: 'The link to this music session has been copied.',
    })
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center gap-3">
          <ListMusic />
          Music Sharing Session
        </CardTitle>
        <CardDescription>
          Upload songs to create a shared playlist. Invite friends to listen along.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid md:grid-cols-2 gap-6">
        <div className="flex flex-col bg-background/50 p-4 rounded-lg border">
            <h3 className="text-lg font-semibold mb-3">Now Playing</h3>
            <div className="flex-1 flex flex-col items-center justify-center text-center p-4 bg-muted/30 rounded-md min-h-[150px]">
                {currentTrack ? (
                    <>
                        <p className="font-bold text-lg text-primary">{currentTrack.name}</p>
                        <p className="text-sm text-muted-foreground">Playing from your local files</p>
                    </>
                ) : (
                    <p className="text-muted-foreground">Upload a song to start</p>
                )}
            </div>
            <div className="mt-4 space-y-3">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{formatTime(currentTime)}</span>
                    <Slider value={[currentTime]} max={duration || 100} onValueChange={handleSeek} />
                    <span>{formatTime(duration)}</span>
                </div>
                <div className="flex justify-between items-center">
                    <Button variant="ghost" size="icon" onClick={handleMute}>
                        {isMuted ? <VolumeX /> : <Volume2 />}
                    </Button>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={handlePrev} disabled={playlist.length < 2}>
                            <StepBack />
                        </Button>
                        <Button size="lg" onClick={handlePlayPause} disabled={!currentTrack}>
                            {isPlaying ? <Pause /> : <Play />}
                        </Button>
                        <Button variant="ghost" size="icon" onClick={handleNext} disabled={playlist.length < 2}>
                            <StepForward />
                        </Button>
                    </div>
                    {/* Placeholder for volume slider or other controls */}
                    <div className="w-8"></div>
                </div>
            </div>
            <audio ref={audioRef} />
        </div>

        <div className="flex flex-col bg-background/50 p-4 rounded-lg border">
            <h3 className="text-lg font-semibold mb-3">Playlist</h3>
            <ScrollArea className="flex-1 bg-muted/30 rounded-md min-h-[200px]">
                {playlist.length > 0 ? (
                    <ul className="p-2">
                        {playlist.map((track, index) => (
                            <li key={index} 
                                className={`p-2 rounded-md cursor-pointer hover:bg-primary/20 ${index === currentTrackIndex ? 'bg-primary/30 font-bold' : ''}`}
                                onClick={() => selectTrack(index)}
                            >
                                {track.name}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                        Your playlist is empty.
                    </div>
                )}
            </ScrollArea>
        </div>
      </CardContent>
      <CardFooter className="gap-4">
        <Button onClick={() => fileInputRef.current?.click()} className="w-full">
          <Upload className="mr-2" />
          Upload Songs
        </Button>
        <Button onClick={handleInvite} variant="outline" className="w-full">
            <LinkIcon className="mr-2"/>
            Get Invite Link
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          className="hidden"
          accept="audio/*"
          multiple
        />
      </CardFooter>
    </Card>
  );
}
