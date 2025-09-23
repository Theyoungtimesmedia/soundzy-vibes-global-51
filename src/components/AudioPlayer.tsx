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
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.beginPath();
        ctx.strokeStyle = 'hsl(var(--primary))';
        ctx.lineWidth = 2;
        
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
    <div className="bg-card rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">{title}</h3>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setVolume(volume === 0 ? 1 : 0)}
          >
            {volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
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

      <div className="relative h-24">
        <canvas
          ref={waveformRef}
          className="w-full h-full"
          width={800}
          height={96}
        />
      </div>

      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={togglePlay}
          className="h-10 w-10 rounded-full"
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
        
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
