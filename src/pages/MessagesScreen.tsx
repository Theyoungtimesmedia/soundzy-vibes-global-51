import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Send, Sparkles, ArrowLeft, MessageCircle, Bot, Paperclip } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  content: string;
  sender_name: string;
  sender_id: string | null;
  is_ai: boolean;
  is_admin: boolean;
  created_at: string;
}

const AI_CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/soundzy-ai`;

const quickChips = [
  { label: '💰 Pricing?', msg: 'What are your pricing options for events?' },
  { label: '📅 Availability?', msg: 'Are you available for an event this month?' },
  { label: '🎵 Services', msg: 'What services does DJ Soundzy offer?' },
  { label: '📦 Equipment?', msg: 'What equipment do you have for sale or rent?' },
  { label: '🗓️ How to book?', msg: 'How do I book DJ Soundzy for my event?' },
];

export default function MessagesScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [aiMode, setAiMode] = useState(false);
  const [aiMessages, setAiMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const [aiStreaming, setAiStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { initChat(); }, []);
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, aiMessages]);

  const initChat = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }
    setUserId(user.id);
    let { data: conv } = await supabase.from('conversations').select('id').eq('user_id', user.id).limit(1).single();
    if (!conv) {
      const { data: newConv } = await supabase.from('conversations').insert({ user_id: user.id, display_name: user.email || 'User' }).select('id').single();
      conv = newConv;
    }
    if (conv) {
      setConversationId(conv.id);
      loadMessages(conv.id);
      supabase.channel(`messages-${conv.id}`)
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${conv.id}` }, (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
        }).subscribe();
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
    await supabase.from('messages').insert({ conversation_id: conversationId, sender_id: userId, sender_name: 'You', content: msg });
    await supabase.from('conversations').update({ last_message: msg, last_message_at: new Date().toISOString() }).eq('id', conversationId);
    setSending(false);
  };

  const sendAiMessage = async (text?: string) => {
    const msg = text || input.trim();
    if (!msg) return;
    setInput('');
    const userMsg = { role: 'user' as const, content: msg };
    const newMsgs = [...aiMessages, userMsg];
    setAiMessages(newMsgs);
    setAiStreaming(true);

    let assistantContent = '';
    try {
      const resp = await fetch(AI_CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: newMsgs }),
      });

      if (!resp.ok || !resp.body) {
        const errData = await resp.json().catch(() => ({}));
        setAiMessages(prev => [...prev, { role: 'assistant', content: errData.error || 'Sorry, I couldn\'t respond right now. Try again!' }]);
        setAiStreaming(false);
        return;
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        let newlineIdx: number;
        while ((newlineIdx = buffer.indexOf('\n')) !== -1) {
          let line = buffer.slice(0, newlineIdx);
          buffer = buffer.slice(newlineIdx + 1);
          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (line.startsWith(':') || line.trim() === '') continue;
          if (!line.startsWith('data: ')) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') break;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantContent += content;
              setAiMessages(prev => {
                const last = prev[prev.length - 1];
                if (last?.role === 'assistant') {
                  return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantContent } : m);
                }
                return [...prev, { role: 'assistant', content: assistantContent }];
              });
            }
          } catch {
            buffer = line + '\n' + buffer;
            break;
          }
        }
      }
      // Flush remaining buffer
      if (buffer.trim()) {
        for (let raw of buffer.split('\n')) {
          if (!raw) continue;
          if (raw.endsWith('\r')) raw = raw.slice(0, -1);
          if (raw.startsWith(':') || raw.trim() === '') continue;
          if (!raw.startsWith('data: ')) continue;
          const jsonStr = raw.slice(6).trim();
          if (jsonStr === '[DONE]') continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantContent += content;
              setAiMessages(prev => {
                const last = prev[prev.length - 1];
                if (last?.role === 'assistant') {
                  return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantContent } : m);
                }
                return [...prev, { role: 'assistant', content: assistantContent }];
              });
            }
          } catch { /* ignore */ }
        }
      }
    } catch (e) {
      console.error('AI stream error:', e);
      setAiMessages(prev => [...prev, { role: 'assistant', content: 'Connection error. Please try again.' }]);
    }
    setAiStreaming(false);
  };

  if (!userId) {
    return (
      <div className="flex flex-col items-center justify-center px-6 pt-20 text-center">
        <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mb-5">
          <MessageCircle className="h-10 w-10 text-primary" />
        </div>
        <h2 className="text-xl font-bold mb-2">Sign in to chat</h2>
        <p className="text-sm text-muted-foreground mb-8">Message DJ Soundzy directly for bookings, orders, and more.</p>
        <Button asChild className="h-14 px-10 bg-primary text-primary-foreground rounded-full font-bold text-sm uppercase tracking-wide">
          <a href="/auth">Sign In</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100dvh-90px-env(safe-area-inset-bottom,0px))]">
      {/* Header */}
      <div className="px-4 py-3 flex items-center gap-3" style={{ background: 'hsl(240 14% 4% / 0.9)', backdropFilter: 'blur(20px)' }}>
        {aiMode ? (
          <>
            <button onClick={() => setAiMode(false)} className="tap-target flex items-center justify-center">
              <ArrowLeft className="h-6 w-6 text-muted-foreground" />
            </button>
            <div className="h-12 w-12 rounded-full bg-primary/15 flex items-center justify-center">
              <Bot className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-base font-bold text-primary">Soundzy AI 🤖</p>
              <p className="text-xs text-muted-foreground">Ask about pricing, services & more</p>
            </div>
          </>
        ) : (
          <>
            <div className="h-12 w-12 rounded-full bg-primary/15 flex items-center justify-center">
              <span className="text-primary font-bold text-base">DJ</span>
            </div>
            <div className="flex-1">
              <p className="text-base font-bold">DJ Soundzy 🎧</p>
              <p className="text-xs text-muted-foreground">● Online · Usually replies in 1hr</p>
            </div>
            <Button onClick={() => setAiMode(true)} className="h-12 px-5 rounded-full bg-primary text-primary-foreground font-bold text-xs uppercase tracking-wide gap-2">
              <Sparkles className="h-4 w-4" /> Ask AI
            </Button>
          </>
        )}
      </div>

      {/* Messages area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
        {aiMode ? (
          <>
            {aiMessages.length === 0 && (
              <div className="text-center py-10">
                <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
                  <Bot className="h-10 w-10 text-primary" />
                </div>
                <p className="text-lg font-bold mb-1">Soundzy AI</p>
                <p className="text-sm text-muted-foreground mb-6">Ask me about pricing, availability, services, or event planning!</p>
                {/* AI Banner */}
                <div className="rounded-2xl p-4 text-left" style={{ background: 'linear-gradient(135deg, hsl(47 93% 54% / 0.08), hsl(38 100% 50% / 0.04))', border: '1px solid hsl(47 93% 54% / 0.15)' }}>
                  <p className="text-sm font-bold text-primary mb-1">✨ Soundzy AI is here!</p>
                  <p className="text-xs text-muted-foreground">Get instant answers about pricing, booking availability, equipment, and event planning.</p>
                </div>
              </div>
            )}
            {aiMessages.map((msg, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                  msg.role === 'user'
                    ? 'bg-primary text-primary-foreground rounded-br-md'
                    : 'bg-card text-foreground rounded-bl-md'
                }`} style={msg.role === 'assistant' ? { border: '1px solid hsl(47 93% 54% / 0.1)' } : {}}>
                  {msg.role === 'assistant' && <p className="text-[11px] text-primary font-bold mb-1">🤖 Soundzy AI</p>}
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                </div>
              </motion.div>
            ))}
            {aiStreaming && aiMessages[aiMessages.length - 1]?.role !== 'assistant' && (
              <div className="flex justify-start">
                <div className="bg-card rounded-2xl rounded-bl-md px-4 py-3" style={{ border: '1px solid hsl(47 93% 54% / 0.1)' }}>
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            {loading ? (
              <div className="space-y-3">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-14 rounded-xl" />)}</div>
            ) : messages.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="h-8 w-8 text-primary" />
                </div>
                <p className="text-base font-bold mb-1">Start a conversation</p>
                <p className="text-sm mt-1">Send a message or tap a quick reply below</p>
              </div>
            ) : (
              messages.map((msg) => {
                const isMe = msg.sender_id === userId && !msg.is_ai && !msg.is_admin;
                return (
                  <motion.div key={msg.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                    className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                      isMe ? 'bg-primary text-primary-foreground rounded-br-md'
                        : 'bg-card text-foreground rounded-bl-md'
                    }`} style={!isMe ? { border: '1px solid hsl(0 0% 100% / 0.06)' } : {}}>
                      {msg.is_ai && <p className="text-[11px] text-primary font-bold mb-1">🤖 Soundzy AI</p>}
                      {msg.is_admin && <p className="text-[11px] text-primary font-bold mb-1">🎧 DJ Soundzy</p>}
                      <p className="text-sm leading-relaxed">{msg.content}</p>
                      <p className="text-[10px] mt-1 opacity-50">{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </motion.div>
                );
              })
            )}
          </>
        )}
      </div>

      {/* Quick chips */}
      {aiMode && aiMessages.length === 0 && (
        <div className="px-4 pb-2 overflow-x-auto no-scrollbar">
          <div className="flex gap-2">
            {quickChips.map((chip) => (
              <button key={chip.label} onClick={() => sendAiMessage(chip.msg)}
                className="shrink-0 px-4 py-2.5 rounded-full text-xs font-semibold bg-primary/10 text-primary hover:bg-primary/20 transition-colors tap-target">
                {chip.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {!aiMode && (
        <div className="px-4 pb-2 overflow-x-auto no-scrollbar">
          <div className="flex gap-2">
            {['I want to book an event', 'About my order', 'Song request', 'Get a quote'].map((qm) => (
              <button key={qm} onClick={() => setInput(qm)}
                className="shrink-0 px-4 py-2.5 rounded-full text-xs font-semibold bg-card text-muted-foreground hover:text-foreground transition-colors tap-target">
                {qm}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="px-4 py-3 flex gap-3" style={{ background: 'hsl(240 14% 6%)' }}>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') aiMode ? sendAiMessage() : sendMessage(); }}
          placeholder={aiMode ? "Ask Soundzy AI..." : "Type a message..."}
          className="h-12 rounded-full bg-card flex-1 text-sm px-5"
          style={{ border: '1px solid hsl(0 0% 100% / 0.06)' }}
        />
        <Button
          onClick={() => aiMode ? sendAiMessage() : sendMessage()}
          disabled={!input.trim() || sending || aiStreaming}
          size="icon"
          className="h-12 w-12 rounded-full bg-primary text-primary-foreground shrink-0"
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
