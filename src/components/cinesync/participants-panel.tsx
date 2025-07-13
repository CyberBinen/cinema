'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Video, VideoOff, Mic, MicOff } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

const ParticipantVideo = ({ stream, name }: { stream: MediaStream | null, name: string }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className="relative aspect-video bg-card rounded-md overflow-hidden border">
      <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
      <div className="absolute bottom-2 left-2 bg-black/50 text-white text-sm px-2 py-1 rounded">
        {name}
      </div>
    </div>
  );
};


export default function ParticipantsPanel() {
  const { toast } = useToast();
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | undefined>(undefined);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const myVideoRef = useRef<HTMLVideoElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isCameraOn && myVideoRef.current && localStream) {
        myVideoRef.current.srcObject = localStream;
    }
  }, [isCameraOn, localStream]);

  const handleToggleCamera = async () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
      setIsCameraOn(false);
      if(myVideoRef.current) myVideoRef.current.srcObject = null;
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setLocalStream(stream);
        setIsCameraOn(true);
        setHasCameraPermission(true);
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera permissions in your browser settings.',
        });
      }
    }
  };


  return (
    <div className="px-4 md:px-6 lg:px-8 pb-8">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="font-headline text-xl">Participants</CardTitle>
                <div className="flex items-center gap-2">
                    <Button onClick={handleToggleCamera} variant={isCameraOn ? "default" : "outline"} size="sm">
                        {isCameraOn ? <VideoOff /> : <Video />}
                        <span className="ml-2">{isCameraOn ? 'Stop Camera' : 'Share Camera'}</span>
                    </Button>
                     <Button variant="outline" size="sm" disabled>
                        <MicOff />
                        <span className="ml-2">Muted</span>
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {localStream && isCameraOn && (
                         <div className="relative aspect-video bg-card rounded-md overflow-hidden border border-primary">
                            <video ref={myVideoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
                            <div className="absolute bottom-2 left-2 bg-black/50 text-white text-sm px-2 py-1 rounded">
                                You
                            </div>
                        </div>
                    )}
                    {/* Mock participants for demonstration */}
                    {isMounted && (
                      <>
                        <ParticipantVideo stream={new MediaStream()} name="Alex" />
                        <ParticipantVideo stream={new MediaStream()} name="Maria" />
                      </>
                    )}

                    {hasCameraPermission === false && (
                        <Alert variant="destructive" className="col-span-full">
                            <AlertTitle>Camera Access Required</AlertTitle>
                            <AlertDescription>
                                To share your video, please allow camera access in your browser settings and click "Share Camera" again.
                            </AlertDescription>
                        </Alert>
                    )}
                </div>
            </CardContent>
        </Card>
    </div>
  );
}
