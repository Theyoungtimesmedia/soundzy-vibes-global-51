import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Send, Sparkles, ArrowLeft, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface Message {
  id: string;
  content: string;
  sender_name: string;
  sender_id: string | null;
  is_ai: boolean;
  is_admin: boolean;
  created_at: string;
}

export default function MessagesScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initChat();
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const initChat = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }
    setUserId(user.id);

    // Find or create conversation
    let { data: conv } = await supabase.from('conversations').select('id').eq('user_id', user.id).limit(1).single();
    if (!conv) {
      const { data: newConv } = await supabase.from('conversations').insert({
        user_id: user.id,
        display_name: user.email || 'User',
      }).select('id').single();
      conv = newConv;
    }
    if (conv) {
      setConversationId(conv.id);
      loadMessages(conv.id);

      // Real-time
      supabase
        .channel(`messages-${conv.id}`)
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${conv.id}` }, (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
        })
        .subscribe();
    }
    setLoading(false);
  };

  const loadMessages = async (convId: string) => {
    const { data } = await supabase.from('messages').select('*').eq('conversation_id', convId).order('created_at');
    if (data) setMessages(data);
  };

  const sendMessage = async () => {
    if (!input.trim() || !conversationId || !userId) return;
    setSending(true);
    const msg = input.trim();
    setInput('');

    await supabase.from('messages').insert({
      conversation_id: conversationId,
      sender_id: userId,
      sender_name: 'You',
      content: msg,
    });

    // Update conversation
    await supabase.from('conversations').update({ last_message: msg, last_message_at: new Date().toISOString() }).eq('id', conversationId);
    setSending(false);
  };

  const quickMessages = ['I want to book an event', 'About my order', 'Song request', 'Get a quote'];

  if (!userId) {
    return (
      <div className="flex flex-col items-center justify-center px-4 pt-20 text-center">
        <MessageCircle className="h-16 w-16 text-muted-foreground/30 mb-4" />
        <h2 className="text-lg font-bold mb-2">Sign in to chat</h2>
        <p className="text-sm text-muted-foreground mb-6">Message DJ Soundzy directly for bookings, orders, and more.</p>
        <Button asChild className="bg-primary text-primary-foreground rounded-xl">
          <a href="/auth">Sign In</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100dvh-60px-env(safe-area-inset-bottom,0px))]">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
          <span className="text-primary font-bold text-sm">DJ</span>
        </div>
        <div>
          <p className="text-sm font-bold">DJ Soundzy 🎧</p>
          <p className="text-[10px] text-muted-foreground">Usually replies within 1 hour</p>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-12 rounded-xl" />)}
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-sm">Start a conversation</p>
            <p className="text-xs mt-1">Send a message or tap a quick reply below</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.sender_id === userId && !msg.is_ai && !msg.is_admin;
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                  isMe
                    ? 'bg-primary text-primary-foreground rounded-br-md'
                    : msg.is_ai
                    ? 'bg-secondary/20 text-foreground rounded-bl-md'
                    : 'bg-card text-foreground border border-border rounded-bl-md'
                }`}>
                  {msg.is_ai && <p className="text-[10px] text-secondary font-bold mb-1">🤖 Soundzy AI</p>}
                  {msg.is_admin && <p className="text-[10px] text-primary font-bold mb-1">🎧 DJ Soundzy</p>}
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                  <p className="text-[9px] mt-1 opacity-60">{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Quick messages */}
      <div className="px-4 pb-2 overflow-x-auto no-scrollbar">
        <div className="flex gap-2">
          {quickMessages.map((qm) => (
            <button
              key={qm}
              onClick={() => { setInput(qm); }}
              className="shrink-0 px-3 py-1.5 rounded-full text-[10px] font-medium bg-card border border-border text-muted-foreground hover:text-foreground transition-colors tap-target"
            >
              {qm}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-border flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') sendMessage(); }}
          placeholder="Type a message..."
          className="h-10 rounded-xl bg-card border-border flex-1 text-sm"
        />
        <Button
          onClick={sendMessage}
          disabled={!input.trim() || sending}
          size="icon"
          className="h-10 w-10 rounded-xl bg-primary text-primary-foreground"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
