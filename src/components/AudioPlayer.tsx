import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';

interface AudioPlayerProps {
  src: string;
  title: string;
}

export const AudioPlayer = ({ src, title }: AudioPlayerProps) => {
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
    if (waveformRef.current && isPlaying) {
      const canvas = waveformRef.current;
      const ctx = canvas.getContext('2d')!;
      let animationId: number;

      const drawWaveform = () => {
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
        gradient.addColorStop(0, 'hsla(43, 74%, 66%, 0.1)');
        gradient.addColorStop(0.5, 'hsla(38, 92%, 50%, 0.1)');
        gradient.addColorStop(1, 'hsla(43, 74%, 66%, 0.1)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.beginPath();
        const strokeGradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
        strokeGradient.addColorStop(0, 'hsl(43, 74%, 66%)');
        strokeGradient.addColorStop(0.5, 'hsl(38, 92%, 50%)');
        strokeGradient.addColorStop(1, 'hsl(43, 74%, 66%)');
        ctx.strokeStyle = strokeGradient;
        ctx.lineWidth = 3;
        
        for (let i = 0; i < canvas.width; i++) {
          const amplitude = Math.sin(i * 0.02 + Date.now() * 0.005) * 30;
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
      return () => cancelAnimationFrame(animationId);
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

  return (
    <div className="bg-gradient-to-br from-card to-card/80 rounded-xl p-6 space-y-6 shadow-glow border border-primary/20">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-lg text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground">
            {audioRef.current && duration > 0 ? `${formatTime(audioRef.current.currentTime)} / ${formatTime(duration)}` : '0:00 / 0:00'}
          </p>
        </div>
        <div className="flex items-center gap-3">
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
            className="w-20"
          />
        </div>
      </div>

      <div className="relative h-32 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 rounded-lg overflow-hidden border border-primary/10">
        <canvas
          ref={waveformRef}
          className="w-full h-full"
          width={800}
          height={128}
        />
        {/* Progress overlay */}
        <div 
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary/20 to-accent/20 transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex items-center gap-4">
        <Button
          size="icon"
          onClick={togglePlay}
          className="h-14 w-14 rounded-full bg-gradient-primary hover:shadow-glow transition-all duration-300"
        >
          {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-1" />}
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
    </div>
  );
};
