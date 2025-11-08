import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Download, Volume2, VolumeX, Repeat, Shuffle, SkipBack, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { motion, AnimatePresence } from 'framer-motion';

interface AudioPlayerProps {
  src: string;
  title: string;
  artist: string;
  genre?: string;
  downloadUrl?: string;
  albumArt?: string;
  playlist?: any[];
  currentIndex?: number;
  onNext?: () => void;
  onPrevious?: () => void;
}

export function AudioPlayer({
  src,
  title,
  artist,
  genre,
  downloadUrl,
  albumArt,
  playlist,
  currentIndex,
  onNext,
  onPrevious
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(70);
  const [isMuted, setIsMuted] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => {
      if (isRepeat) {
        audio.currentTime = 0;
        audio.play();
      } else if (onNext) {
        onNext();
      } else {
        setIsPlaying(false);
      }
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [isRepeat, onNext]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100;
    }
  }, [volume, isMuted]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      
      switch (e.key) {
        case ' ':
          e.preventDefault();
          togglePlayPause();
          break;
        case 'ArrowRight':
          if (onNext) onNext();
          break;
        case 'ArrowLeft':
          if (onPrevious) onPrevious();
          break;
        case 'ArrowUp':
          setVolume(v => Math.min(100, v + 10));
          break;
        case 'ArrowDown':
          setVolume(v => Math.max(0, v - 10));
          break;
        case 'm':
          setIsMuted(m => !m);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [onNext, onPrevious]);

  const togglePlayPause = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative w-full max-w-4xl mx-auto overflow-hidden rounded-3xl shadow-brand"
    >
      {/* Blurred background */}
      <div 
        className="absolute inset-0 bg-cover bg-center blur-3xl opacity-30"
        style={{ backgroundImage: albumArt ? `url(${albumArt})` : 'none' }}
      />
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-card/95 via-card/90 to-card/95 backdrop-blur-xl" />
      
      {/* Content */}
      <div className="relative p-8 md:p-10">
        <div className="flex flex-col md:flex-row gap-8 items-center">
          {/* Album Art */}
          {albumArt && (
            <motion.div 
              className="relative group"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="w-48 h-48 rounded-2xl overflow-hidden shadow-glow ring-2 ring-primary/20">
                <img 
                  src={albumArt} 
                  alt={title}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Animated play indicator */}
              <AnimatePresence>
                {isPlaying && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-2xl"
                  >
                    <div className="flex gap-1">
                      {[...Array(4)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="w-1 bg-primary rounded-full"
                          animate={{
                            height: ["20px", "40px", "20px"],
                          }}
                          transition={{
                            duration: 0.6,
                            repeat: Infinity,
                            delay: i * 0.1,
                          }}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Player Controls */}
          <div className="flex-1 w-full space-y-6">
            {/* Track Info */}
            <div className="text-center md:text-left">
              <h3 className="text-2xl md:text-3xl font-bold mb-2">{title}</h3>
              <p className="text-muted-foreground text-lg mb-1">{artist}</p>
              {genre && (
                <p className="text-sm text-muted-foreground/70">{genre}</p>
              )}
            </div>

            {/* Waveform Progress Bar */}
            <div className="space-y-2">
              <Slider
                value={[currentTime]}
                max={duration || 100}
                step={0.1}
                onValueChange={handleSeek}
                className="cursor-pointer"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsShuffle(!isShuffle)}
                className={isShuffle ? 'text-primary' : 'text-muted-foreground'}
              >
                <Shuffle className="h-4 w-4" />
              </Button>

              {onPrevious && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onPrevious}
                  className="hover:text-primary"
                >
                  <SkipBack className="h-5 w-5" />
                </Button>
              )}

              <Button
                size="icon"
                onClick={togglePlayPause}
                className="h-16 w-16 rounded-full bg-gradient-primary hover:shadow-accent transition-all duration-300 hover:scale-110"
              >
                <AnimatePresence mode="wait">
                  {isPlaying ? (
                    <motion.div
                      key="pause"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                    >
                      <Pause className="h-6 w-6 text-black" fill="currentColor" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="play"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                    >
                      <Play className="h-6 w-6 text-black ml-1" fill="currentColor" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>

              {onNext && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onNext}
                  className="hover:text-primary"
                >
                  <SkipForward className="h-5 w-5" />
                </Button>
              )}

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsRepeat(!isRepeat)}
                className={isRepeat ? 'text-primary' : 'text-muted-foreground'}
              >
                <Repeat className="h-4 w-4" />
              </Button>
            </div>

            {/* Volume and Download */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1 max-w-xs">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMuted(!isMuted)}
                  className="shrink-0"
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="h-5 w-5" />
                  ) : (
                    <Volume2 className="h-5 w-5" />
                  )}
                </Button>
                <Slider
                  value={[isMuted ? 0 : volume]}
                  max={100}
                  step={1}
                  onValueChange={(v) => {
                    setVolume(v[0]);
                    setIsMuted(false);
                  }}
                  className="flex-1"
                />
              </div>

              {downloadUrl && (
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="gap-2"
                >
                  <a href={downloadUrl} download>
                    <Download className="h-4 w-4" />
                    Download
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <audio ref={audioRef} src={src} preload="metadata" />
    </motion.div>
  );
}
