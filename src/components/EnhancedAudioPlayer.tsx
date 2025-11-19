import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Download, Share2, Repeat, Shuffle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';

interface EnhancedAudioPlayerProps {
  title: string;
  artist: string;
  audioUrl: string;
  coverImage?: string;
  genre?: string;
  duration?: number;
  onNext?: () => void;
  onPrevious?: () => void;
  playlist?: Array<{ title: string; artist: string; audioUrl: string; coverImage?: string }>;
}

export const EnhancedAudioPlayer = ({
  title,
  artist,
  audioUrl,
  coverImage,
  genre,
  duration,
  onNext,
  onPrevious,
  playlist = [],
}: EnhancedAudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(duration || 0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setTotalDuration(audio.duration);
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

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = value[0];
    setCurrentTime(value[0]);
  };

  const handleVolumeChange = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;
    const newVolume = value[0];
    audio.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isMuted) {
      audio.volume = volume;
      setIsMuted(false);
    } else {
      audio.volume = 0;
      setIsMuted(true);
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = audioUrl;
    link.download = `${artist} - ${title}.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Download started');
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: `${artist} - ${title}`,
        text: `Listen to ${title} by ${artist}`,
        url: window.location.href,
      });
    } catch (err) {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-gradient-to-br from-primary/10 via-background to-secondary/10 rounded-2xl shadow-2xl overflow-hidden">
      <audio ref={audioRef} src={audioUrl} />
      
      {/* Album Art Section */}
      <div className="relative h-80 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/90" />
        <img
          src={coverImage || '/placeholder.svg'}
          alt={title}
          className="w-full h-full object-cover blur-sm scale-110"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <img
            src={coverImage || '/placeholder.svg'}
            alt={title}
            className="w-64 h-64 object-cover rounded-lg shadow-2xl ring-4 ring-primary/20"
          />
        </div>
      </div>

      {/* Track Info */}
      <div className="p-6 text-center">
        <h2 className="text-3xl font-bold text-foreground mb-2">{title}</h2>
        <p className="text-xl text-muted-foreground mb-1">{artist}</p>
        {genre && (
          <span className="inline-block px-3 py-1 bg-primary/20 text-primary rounded-full text-sm">
            {genre}
          </span>
        )}
      </div>

      {/* Progress Bar */}
      <div className="px-6">
        <Slider
          value={[currentTime]}
          max={totalDuration || 100}
          step={0.1}
          onValueChange={handleSeek}
          className="w-full"
        />
        <div className="flex justify-between text-sm text-muted-foreground mt-2">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(totalDuration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsShuffle(!isShuffle)}
            className={isShuffle ? 'text-primary' : 'text-muted-foreground'}
          >
            <Shuffle className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsRepeat(!isRepeat)}
            className={isRepeat ? 'text-primary' : 'text-muted-foreground'}
          >
            <Repeat className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onPrevious}
            disabled={!onPrevious}
          >
            <SkipBack className="w-6 h-6" />
          </Button>
          
          <Button
            size="icon"
            onClick={togglePlay}
            className="w-16 h-16 rounded-full bg-primary hover:bg-primary/90"
          >
            {isPlaying ? (
              <Pause className="w-8 h-8" />
            ) : (
              <Play className="w-8 h-8 ml-1" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={onNext}
            disabled={!onNext}
          >
            <SkipForward className="w-6 h-6" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={handleDownload}>
            <Download className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleShare}>
            <Share2 className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Volume Control */}
      <div className="px-6 pb-6 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={toggleMute}>
          {isMuted ? (
            <VolumeX className="w-5 h-5" />
          ) : (
            <Volume2 className="w-5 h-5" />
          )}
        </Button>
        <Slider
          value={[isMuted ? 0 : volume]}
          max={1}
          step={0.01}
          onValueChange={handleVolumeChange}
          className="w-32"
        />
      </div>

      {/* Playlist Queue */}
      {playlist.length > 0 && (
        <div className="border-t border-border p-6">
          <h3 className="text-lg font-semibold mb-4">Up Next</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {playlist.map((track, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/50 cursor-pointer transition-colors"
              >
                <img
                  src={track.coverImage || '/placeholder.svg'}
                  alt={track.title}
                  className="w-12 h-12 rounded object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{track.title}</p>
                  <p className="text-sm text-muted-foreground truncate">{track.artist}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
