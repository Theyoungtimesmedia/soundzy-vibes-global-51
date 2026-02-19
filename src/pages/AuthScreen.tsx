import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAppStore } from '@/stores/useAppStore';
import { Loader2, Mail, Lock, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type AuthMode = 'splash' | 'signin' | 'signup' | 'guest';

export default function AuthScreen() {
  const [mode, setMode] = useState<AuthMode>('splash');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [guestName, setGuestName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();
  const setGuest = useAppStore((s) => s.setGuest);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    if (err) { setError(err.message); setLoading(false); return; }
    navigate('/');
    setLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error: err } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: { full_name: fullName },
      },
    });
    if (err) { setError(err.message); setLoading(false); return; }
    toast({ title: 'Check your email', description: 'We sent you a confirmation link.' });
    setLoading(false);
  };

  const handleGuest = async () => {
    if (!guestName.trim()) return;
    setLoading(true);
    const id = crypto.randomUUID();
    // Store guest in supabase
    await supabase.from('guest_sessions').insert({ id, display_name: guestName.trim() });
    setGuest(guestName.trim(), id);
    navigate('/');
    setLoading(false);
  };

  // Equalizer bars for splash
  const EqualizerBars = () => (
    <div className="flex items-end gap-1 h-24 opacity-20">
      {[...Array(7)].map((_, i) => (
        <div
          key={i}
          className="w-1.5 bg-primary rounded-full equalizer-bar"
          style={{ height: '20%' }}
        />
      ))}
    </div>
  );

  if (mode === 'splash') {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 relative overflow-hidden">
        {/* Background equalizer */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <EqualizerBars />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 flex flex-col items-center text-center max-w-sm"
        >
          <img src="/favicon.png" alt="Soundzy" className="h-24 w-24 mb-6" />
          <h1 className="text-3xl font-bold text-foreground mb-2" style={{ fontFamily: "'Space Grotesk'" }}>
            SOUNDZY WORLD
          </h1>
          <p className="text-primary text-sm font-medium mb-2">Your VIP Pass to the Best Vibes in Port Harcourt</p>
          <p className="text-muted-foreground text-xs mb-10">Book events, shop gear, join the community</p>

          <div className="w-full space-y-3">
            <Button
              onClick={() => setMode('signin')}
              className="w-full h-12 bg-primary text-primary-foreground font-bold text-sm rounded-xl hover:bg-primary/90"
            >
              <Mail className="mr-2 h-4 w-4" />
              Continue with Email
            </Button>

            <Button
              onClick={() => setMode('signup')}
              variant="outline"
              className="w-full h-12 text-sm rounded-xl border-border"
            >
              Create Account
            </Button>

            <button
              onClick={() => setMode('guest')}
              className="text-muted-foreground text-xs underline underline-offset-4 hover:text-foreground transition-colors tap-target"
            >
              Continue as Guest
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col px-6 pt-16 pb-8">
      <button
        onClick={() => setMode('splash')}
        className="text-muted-foreground text-sm mb-8 self-start tap-target"
      >
        ← Back
      </button>

      <AnimatePresence mode="wait">
        <motion.div
          key={mode}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="flex-1"
        >
          {mode === 'guest' ? (
            <div>
              <h2 className="text-2xl font-bold mb-2">What should we call you?</h2>
              <p className="text-muted-foreground text-sm mb-8">You can create a full account anytime.</p>
              <div className="space-y-4">
                <Input
                  placeholder="Your name"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="h-12 rounded-xl bg-card border-border"
                  maxLength={50}
                />
                <Button
                  onClick={handleGuest}
                  disabled={!guestName.trim() || loading}
                  className="w-full h-12 bg-primary text-primary-foreground font-bold rounded-xl"
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Enter as {guestName.trim() || 'Guest'} 🎧
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <h2 className="text-2xl font-bold mb-2">
                {mode === 'signin' ? 'Welcome back' : 'Create your account'}
              </h2>
              <p className="text-muted-foreground text-sm mb-8">
                {mode === 'signin' ? 'Sign in to continue' : 'Join the Soundzy community'}
              </p>

              {error && (
                <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-xl mb-4">
                  {error}
                </div>
              )}

              <form onSubmit={mode === 'signin' ? handleSignIn : handleSignUp} className="space-y-4">
                {mode === 'signup' && (
                  <div>
                    <Label className="text-xs text-muted-foreground mb-1.5 block">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Your name"
                        className="h-12 pl-10 rounded-xl bg-card border-border"
                        required
                      />
                    </div>
                  </div>
                )}

                <div>
                  <Label className="text-xs text-muted-foreground mb-1.5 block">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="h-12 pl-10 rounded-xl bg-card border-border"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-xs text-muted-foreground mb-1.5 block">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="h-12 pl-10 rounded-xl bg-card border-border"
                      required
                      minLength={6}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-primary text-primary-foreground font-bold rounded-xl"
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {mode === 'signin' ? 'Sign In' : 'Create Account'}
                </Button>
              </form>

              <button
                onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
                className="text-muted-foreground text-xs mt-4 block text-center w-full tap-target"
              >
                {mode === 'signin' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
              </button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
