import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Play, Pause, SkipBack, SkipForward, Heart, X, Music, Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Mixtape {
  id: string;
  title: string;
  genre: string | null;
  artwork_url: string | null;
  audio_url: string | null;
  duration: number | null;
  likes_count: number | null;
}

const genreColors: Record<string, string> = {
  'Afrobeats': 'bg-primary/20 text-primary border-primary/30',
  'Hip-Hop': 'bg-secondary/20 text-secondary border-secondary/30',
  'Party Anthems': 'bg-[hsl(var(--app-success))]/20 text-[hsl(var(--app-success))] border-[hsl(var(--app-success))]/30',
  'R&B': 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  'Gospel': 'bg-amber-500/20 text-amber-400 border-amber-500/30',
};

export default function MixtapesScreen() {
  const [mixtapes, setMixtapes] = useState<Mixtape[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeGenre, setActiveGenre] = useState('All');
  const [currentTrack, setCurrentTrack] = useState<Mixtape | null>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showFullPlayer, setShowFullPlayer] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => { loadMixtapes(); }, []);

  const loadMixtapes = async () => {
    const { data } = await supabase.from('mixtapes').select('*').order('created_at', { ascending: false });
    if (data) setMixtapes(data);
    setLoading(false);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const update = () => {
      if (audio.duration) setProgress((audio.currentTime / audio.duration) * 100);
    };
    audio.addEventListener('timeupdate', update);
    return () => audio.removeEventListener('timeupdate', update);
  }, [currentTrack]);

  const playTrack = (mixtape: Mixtape) => {
    if (currentTrack?.id === mixtape.id) {
      if (playing) { audioRef.current?.pause(); setPlaying(false); }
      else { audioRef.current?.play(); setPlaying(true); }
      return;
    }
    setCurrentTrack(mixtape);
    setPlaying(true);
    setProgress(0);
    setTimeout(() => audioRef.current?.play(), 100);
  };

  const skipNext = () => {
    const idx = mixtapes.findIndex(m => m.id === currentTrack?.id);
    if (idx >= 0 && idx < mixtapes.length - 1) playTrack(mixtapes[idx + 1]);
  };
  const skipPrev = () => {
    const idx = mixtapes.findIndex(m => m.id === currentTrack?.id);
    if (idx > 0) playTrack(mixtapes[idx - 1]);
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    return `${m}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
  };

  const genres = ['All', ...Array.from(new Set(mixtapes.map(m => m.genre).filter(Boolean)))];
  const filtered = activeGenre === 'All' ? mixtapes : mixtapes.filter(m => m.genre === activeGenre);
  const featured = mixtapes[0];

  return (
    <div className="flex flex-col pb-24">
      <audio ref={audioRef} src={currentTrack?.audio_url || ''} onEnded={skipNext} />

      {/* Header */}
      <div className="px-4 pt-6 pb-4">
        <h1 className="text-2xl font-bold">Mixtapes 🎶</h1>
        <p className="text-xs text-muted-foreground">The hottest Afrobeats, Hip-Hop & Party Anthems</p>
      </div>

      {/* Featured */}
      {featured && (
        <div className="px-4 mb-4">
          <div className="relative rounded-2xl overflow-hidden h-[200px]">
            {featured.artwork_url ? (
              <img src={featured.artwork_url} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-card to-muted" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <Badge className="bg-primary/80 text-primary-foreground text-[9px] mb-2">FEATURED</Badge>
              <p className="text-lg font-bold text-white">{featured.title}</p>
              <p className="text-xs text-white/70">By DJ Soundzy</p>
              {featured.genre && (
                <Badge variant="outline" className={`text-[9px] mt-1 ${genreColors[featured.genre] || 'border-border text-muted-foreground'}`}>
                  {featured.genre}
                </Badge>
              )}
            </div>
            <button
              onClick={() => playTrack(featured)}
              className="absolute right-4 bottom-4 h-14 w-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg"
            >
              {currentTrack?.id === featured.id && playing ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-0.5" />}
            </button>
          </div>
        </div>
      )}

      {/* Genre chips */}
      <div className="px-4 pb-3 overflow-x-auto no-scrollbar">
        <div className="flex gap-2">
          {genres.map(g => (
            <button key={g} onClick={() => setActiveGenre(g!)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors tap-target ${
                activeGenre === g ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground border border-border'
              }`}>
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="px-4 space-y-2">
        {loading ? (
          [1, 2, 3, 4].map(i => <Skeleton key={i} className="h-20 rounded-xl" />)
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Music className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No mixtapes yet</p>
          </div>
        ) : (
          filtered.map((tape) => {
            const isActive = currentTrack?.id === tape.id;
            return (
              <motion.div key={tape.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${isActive ? 'bg-card border border-primary/20' : 'bg-card/50 border border-transparent'}`}
                onClick={() => playTrack(tape)}
              >
                <div className="h-[60px] w-[60px] rounded-lg overflow-hidden shrink-0 relative">
                  {tape.artwork_url ? (
                    <img src={tape.artwork_url} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full bg-muted flex items-center justify-center"><Music className="h-5 w-5 text-muted-foreground" /></div>
                  )}
                  {isActive && playing && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="flex items-end gap-0.5 h-4">
                        {[1,2,3].map(i => <span key={i} className="w-1 bg-primary rounded-full equalizer-bar" style={{ height: '40%' }} />)}
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate">{tape.title}</p>
                  <p className="text-[11px] text-muted-foreground">By DJ Soundzy</p>
                  {tape.genre && (
                    <Badge variant="outline" className={`text-[9px] h-4 mt-0.5 ${genreColors[tape.genre] || 'border-border text-muted-foreground'}`}>
                      {tape.genre}
                    </Badge>
                  )}
                  {tape.duration && <p className="text-[10px] text-muted-foreground mt-0.5">{formatTime(tape.duration)}</p>}
                </div>
                <div className="flex items-center gap-2">
                  <button className="tap-target text-muted-foreground hover:text-primary"><Heart className="h-4 w-4" /></button>
                  <button className="h-10 w-10 rounded-full bg-card border border-border flex items-center justify-center text-primary">
                    {isActive && playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
                  </button>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Mini Player */}
      <AnimatePresence>
        {currentTrack && (
          <motion.div
            initial={{ y: 80 }} animate={{ y: 0 }} exit={{ y: 80 }}
            className="fixed bottom-[calc(60px+env(safe-area-inset-bottom,0px))] left-0 right-0 z-40"
            onClick={() => setShowFullPlayer(true)}
          >
            <div className="app-container px-4">
              <div className="bg-card border border-border rounded-2xl p-2 flex items-center gap-3 relative overflow-hidden">
                <div className="absolute top-0 left-0 h-0.5 bg-primary transition-all" style={{ width: `${progress}%` }} />
                {currentTrack.artwork_url && (
                  <img src={currentTrack.artwork_url} alt="" className="h-12 w-12 rounded-lg object-cover" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold truncate">{currentTrack.title}</p>
                  <p className="text-[10px] text-muted-foreground">DJ Soundzy</p>
                </div>
                <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                  <button onClick={skipPrev} className="tap-target"><SkipBack className="h-4 w-4 text-muted-foreground" /></button>
                  <button onClick={() => playTrack(currentTrack)} className="h-9 w-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                    {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
                  </button>
                  <button onClick={skipNext} className="tap-target"><SkipForward className="h-4 w-4 text-muted-foreground" /></button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full Player */}
      <AnimatePresence>
        {showFullPlayer && currentTrack && (
          <motion.div
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed inset-0 z-50 bg-background flex flex-col"
          >
            <div className="flex items-center justify-between p-4">
              <button onClick={() => setShowFullPlayer(false)} className="tap-target"><X className="h-5 w-5 text-muted-foreground" /></button>
              <p className="text-xs text-muted-foreground font-medium">NOW PLAYING</p>
              <button className="tap-target"><Share2 className="h-5 w-5 text-muted-foreground" /></button>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center px-8">
              <div className={`w-[260px] h-[260px] rounded-2xl overflow-hidden shadow-2xl mb-8 ${playing ? 'animate-[spin_20s_linear_infinite]' : ''}`}
                style={{ animationPlayState: playing ? 'running' : 'paused' }}>
                {currentTrack.artwork_url ? (
                  <img src={currentTrack.artwork_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-card to-muted flex items-center justify-center">
                    <Music className="h-16 w-16 text-muted-foreground" />
                  </div>
                )}
              </div>

              <p className="text-xl font-bold text-center mb-1">{currentTrack.title}</p>
              <p className="text-sm text-muted-foreground mb-2">By DJ Soundzy</p>
              {currentTrack.genre && (
                <Badge variant="outline" className={`text-[10px] mb-6 ${genreColors[currentTrack.genre] || 'border-border text-muted-foreground'}`}>
                  {currentTrack.genre}
                </Badge>
              )}

              <button className="flex items-center gap-1 text-muted-foreground mb-8 tap-target">
                <Heart className="h-5 w-5" />
                <span className="text-xs">{currentTrack.likes_count || 0}</span>
              </button>

              {/* Progress */}
              <div className="w-full mb-6">
                <div className="w-full h-1 bg-muted rounded-full overflow-hidden cursor-pointer"
                  onClick={(e) => {
                    if (!audioRef.current) return;
                    const rect = e.currentTarget.getBoundingClientRect();
                    const pct = (e.clientX - rect.left) / rect.width;
                    audioRef.current.currentTime = pct * (audioRef.current.duration || 0);
                  }}>
                  <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${progress}%` }} />
                </div>
                <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                  <span>{audioRef.current ? formatTime(audioRef.current.currentTime) : '0:00'}</span>
                  <span>{currentTrack.duration ? formatTime(currentTrack.duration) : '--:--'}</span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-8">
                <button onClick={skipPrev} className="tap-target"><SkipBack className="h-6 w-6 text-muted-foreground" /></button>
                <button onClick={() => playTrack(currentTrack)} className="h-16 w-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg">
                  {playing ? <Pause className="h-7 w-7" /> : <Play className="h-7 w-7 ml-1" />}
                </button>
                <button onClick={skipNext} className="tap-target"><SkipForward className="h-6 w-6 text-muted-foreground" /></button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
