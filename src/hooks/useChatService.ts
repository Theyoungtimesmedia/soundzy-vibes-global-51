import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ChatResponse {
  content: string;
  quickReplies?: string[];
  intent?: string;
  confidence?: number;
}

export function useChatService() {
  const [isLoading, setIsLoading] = useState(false);

  const generateSessionId = () => {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const sendMessage = async (message: string, sessionId: string): Promise<ChatResponse> => {
    setIsLoading(true);
    
    try {
      // Call Gemini-powered edge function
      const { data, error } = await supabase.functions.invoke('chat', {
        body: { 
          message, 
          sessionId 
        }
      });

      if (error) throw error;

      return {
        content: data.response,
        quickReplies: data.quickReplies || [],
        intent: data.intent || 'general_inquiry',
        confidence: data.confidence || 0.6
      };
    } catch (error) {
      console.error('Chat service error:', error);
      
      // Fallback response if AI service fails
      return {
        content: "I apologize, but I'm having trouble processing your request right now. Please try contacting us directly via WhatsApp at +234 816 668 7167 or email Info@soundzyworld.com.ng for immediate assistance.",
        quickReplies: ['WhatsApp Me', 'Try Again'],
        intent: 'error',
        confidence: 0
      };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sendMessage,
    generateSessionId,
    isLoading
  };
}
