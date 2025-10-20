import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Download, Share2, Instagram, Facebook, Twitter } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface AudioPlayerProps {
  src: string;
  title: string;
  artist?: string;
  albumArt?: string;
  downloadUrl?: string;
  genre?: string;
}

export const AudioPlayer = ({ 
  src, 
  title, 
  artist = "DJ Soundzy",
  albumArt = "/lovable-uploads/908ec127-5e76-4301-84c0-34eddfc15eb2.png",
  downloadUrl,
  genre = "Afrobeats"
}: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const waveformRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (waveformRef.current) {
      const canvas = waveformRef.current;
      // SAFARI FIX: Safe canvas context handling with null check
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        console.warn('Canvas context not available - waveform disabled for Safari compatibility');
        return; // Gracefully degrade - audio will still work
      }
      let animationId: number;
      let isMounted = true; // SAFARI FIX: Prevent updates after unmount

      const drawWaveform = () => {
        if (!isMounted || !ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Background gradient
        const bgGradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
        bgGradient.addColorStop(0, 'hsla(45, 100%, 60%, 0.05)');
        bgGradient.addColorStop(0.5, 'hsla(38, 100%, 55%, 0.08)');
        bgGradient.addColorStop(1, 'hsla(45, 100%, 60%, 0.05)');
        ctx.fillStyle = bgGradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Animated waveform
        ctx.beginPath();
        const strokeGradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
        strokeGradient.addColorStop(0, 'hsl(45, 100%, 60%)');
        strokeGradient.addColorStop(0.5, 'hsl(38, 100%, 55%)');
        strokeGradient.addColorStop(1, 'hsl(42, 95%, 50%)');
        ctx.strokeStyle = strokeGradient;
        ctx.lineWidth = 4;
        ctx.shadowBlur = isPlaying ? 15 : 5;
        ctx.shadowColor = 'hsl(45, 100%, 60%)';
        
        const time = isPlaying ? Date.now() * 0.003 : 0;
        for (let i = 0; i < canvas.width; i += 2) {
          const amplitude = isPlaying 
            ? Math.sin(i * 0.015 + time) * 35 + Math.sin(i * 0.03 + time * 1.5) * 20
            : Math.sin(i * 0.02) * 15;
          const y = canvas.height / 2 + amplitude;
          
          if (i === 0) {
            ctx.moveTo(i, y);
          } else {
            ctx.lineTo(i, y);
          }
        }
        
        ctx.stroke();
        animationId = requestAnimationFrame(drawWaveform);
      };

      drawWaveform();
      // SAFARI FIX: Proper cleanup to prevent memory leaks
      return () => {
        isMounted = false;
        if (animationId) {
          cancelAnimationFrame(animationId);
        }
      };
    }
  }, [isPlaying]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // SAFARI FIX: Safe window.open with fallback for popup blockers
  const safeWindowOpen = (url: string) => {
    try {
      const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
      if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
        // Popup was blocked - fallback to direct navigation
        window.location.href = url;
      }
    } catch (error) {
      console.warn('Popup blocked, using fallback navigation:', error);
      window.location.href = url;
    }
  };

  const handleShare = (platform: string) => {
    // SAFARI FIX: Guard for Safari compatibility
    if (typeof window === 'undefined') return;
    
    const text = `Check out "${title}" by ${artist} 🎵`;
    const url = window.location.href;
    
    const shareUrls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      instagram: `https://www.instagram.com/`,
    };
    
    if (shareUrls[platform]) {
      safeWindowOpen(shareUrls[platform]);
    }
  };

  return (
    <div className="bg-gradient-to-br from-card via-card to-card/90 rounded-2xl overflow-hidden shadow-glow border border-primary/30">
      <div className="grid md:grid-cols-[300px_1fr] gap-6 p-6">
        {/* Album Art */}
        <div className="flex flex-col items-center space-y-4">
          <div className="relative w-full aspect-square rounded-xl overflow-hidden shadow-accent border-2 border-primary/20">
            <img 
              src={albumArt} 
              alt={`${title} Album Art`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>
          
          {/* Genre Badge */}
          <Badge variant="outline" className="bg-primary/10 border-primary/30 text-primary">
            {genre}
          </Badge>
        </div>

        {/* Player Controls */}
        <div className="space-y-6">
          {/* Track Info */}
          <div className="space-y-2">
            <h3 className="font-bold text-2xl text-foreground leading-tight">{title}</h3>
            <p className="text-lg text-primary font-semibold">{artist}</p>
            <p className="text-sm text-muted-foreground">
              {audioRef.current && duration > 0 
                ? `${formatTime(audioRef.current.currentTime)} / ${formatTime(duration)}` 
                : '0:00 / 0:00'}
            </p>
          </div>

          {/* Waveform Visualization */}
          <div className="relative h-24 bg-gradient-to-r from-primary/5 via-accent/8 to-primary/5 rounded-xl overflow-hidden border border-primary/20">
            <canvas
              ref={waveformRef}
              className="w-full h-full"
              width={800}
              height={96}
            />
            {/* Progress overlay */}
            <div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary/30 to-accent/30 transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Playback Controls */}
          <div className="flex items-center gap-4">
            <Button
              size="icon"
              onClick={togglePlay}
              className="h-16 w-16 rounded-full bg-gradient-primary hover:shadow-glow transition-all duration-300 flex-shrink-0"
            >
              {isPlaying ? <Pause className="h-7 w-7" /> : <Play className="h-7 w-7 ml-1" />}
            </Button>
            
            <div className="flex-1">
              <Slider
                value={[progress]}
                max={100}
                step={0.1}
                onValueChange={(value) => {
                  if (audioRef.current && duration > 0) {
                    audioRef.current.currentTime = (value[0] / 100) * duration;
                  }
                }}
                className="cursor-pointer"
              />
            </div>

            {/* Volume Control */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setVolume(volume === 0 ? 1 : 0)}
                className="hover:bg-primary/10"
              >
                {volume === 0 ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </Button>
              <Slider
                value={[volume * 100]}
                max={100}
                step={1}
                onValueChange={(value) => setVolume(value[0] / 100)}
                className="w-24"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            {downloadUrl && (
              <Button 
                variant="outline" 
                size="sm"
                className="border-primary/30 hover:bg-primary/10"
                asChild
              >
                <a href={downloadUrl} download>
                  <Download className="h-4 w-4 mr-2" />
                  Download Mix
                </a>
              </Button>
            )}
            
            <Button 
              variant="outline" 
              size="sm"
              className="border-primary/30 hover:bg-primary/10"
              onClick={() => handleShare('twitter')}
            >
              <Twitter className="h-4 w-4 mr-2" />
              Share
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              className="border-primary/30 hover:bg-primary/10"
              onClick={() => handleShare('facebook')}
            >
              <Facebook className="h-4 w-4 mr-2" />
              Share
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              className="border-primary/30 hover:bg-primary/10"
              onClick={() => handleShare('instagram')}
            >
              <Instagram className="h-4 w-4 mr-2" />
              Share
            </Button>
            
            <Button 
              variant="default" 
              size="sm"
              className="bg-gradient-primary hover:shadow-accent"
              asChild
            >
              <a 
                href="https://wa.me/2348166687167?text=Hi! I'd love to book DJ Soundzy for my event!" 
                target="_blank"
                rel="noopener noreferrer"
              >
                Book DJ Soundzy
              </a>
            </Button>
          </div>
        </div>
      </div>
      
      <audio
        ref={audioRef}
        src={src}
        onTimeUpdate={() => {
          if (audioRef.current) {
            setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
          }
        }}
        onLoadedMetadata={() => {
          if (audioRef.current) {
            setDuration(audioRef.current.duration);
          }
        }}
        onEnded={() => setIsPlaying(false)}
      />
    </div>
  );
};
