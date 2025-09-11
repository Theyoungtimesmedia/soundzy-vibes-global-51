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
      // Save user message to database using raw SQL query
      const { error: saveError } = await supabase.rpc('save_chat_message', {
        p_session_id: sessionId,
        p_direction: 'inbound',
        p_message: message,
        p_metadata: JSON.stringify({
          timestamp: new Date().toISOString(),
          source: 'chat_widget'
        })
      });

      if (saveError) {
        console.error('Error saving message:', saveError);
      }

      // Call Gemini API (mock response for now)
      const response = await mockGeminiResponse(message);

      // Save bot response to database
      const { error: saveResponseError } = await supabase.rpc('save_chat_message', {
        p_session_id: sessionId,
        p_direction: 'outbound',
        p_message: response.content,
        p_metadata: JSON.stringify({
          intent: response.intent,
          confidence: response.confidence,
          quick_replies: response.quickReplies,
          timestamp: new Date().toISOString()
        })
      });

      if (saveResponseError) {
        console.error('Error saving response:', saveResponseError);
      }

      return response;
    } catch (error) {
      console.error('Chat service error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Mock Gemini response - replace with actual Gemini API call
  const mockGeminiResponse = async (message: string): Promise<ChatResponse> => {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
    
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('book') || lowerMessage.includes('dj')) {
      return {
        content: "That's exciting! Can I grab a few details so I can set up your event with the best vibe ever?\n\n• Your full name and phone number\n• Your event date, location, and type of service (e.g. DJ set, MC)\n• Any special needs or requests\n\nYou can reach us on WhatsApp at +2348166687167 or email soundzybeatz@gmail.com.",
        quickReplies: ['Share Details', 'Call Me Instead', 'WhatsApp Me'],
        intent: 'booking_inquiry',
        confidence: 0.9
      };
    }
    
    if (lowerMessage.includes('shop') || lowerMessage.includes('gear') || lowerMessage.includes('equipment')) {
      return {
        content: "Great choice! We've got professional audio and stage gear ready to ship.\n\nWhat are you looking for?\n• Speakers & Sound Systems\n• Mixers & DJ Equipment\n• Stage Lighting\n• Installation Services\n\nChat on WhatsApp: +2348166687167 or email soundzybeatz@gmail.com.",
        quickReplies: ['Browse Speakers', 'DJ Equipment', 'Stage Lights', 'Get Quote'],
        intent: 'shop_inquiry',
        confidence: 0.85
      };
    }
    
    if (lowerMessage.includes('showreel') || lowerMessage.includes('video') || lowerMessage.includes('tape')) {
      return {
        content: "Sure thing! Here are some of DJ Soundzy's iconic mixes:\n\n🎵 Flashback Mix (2024) — 10 minutes\n🎵 Weekend Vibes (2025) — 8 minutes\n🎵 Festival Energy (2024) — 12 minutes\n\nFor bookings or info: WhatsApp +2348166687167, email soundzybeatz@gmail.com.",
        quickReplies: ['Play Flashback Mix', 'Weekend Vibes', 'Festival Energy', 'All Showreels'],
        intent: 'media_request',
        confidence: 0.95
      };
    }
    
    if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('rate')) {
      return {
        content: "Great question! Our pricing depends on the service you want—DJ sets, equipment hire, production, and more all vary.\n\nTell me which service and your event date, and I’ll share a personalised estimate.\n\nContact: WhatsApp +2348166687167 or email soundzybeatz@gmail.com.",
        quickReplies: ['DJ Pricing', 'Equipment Rates', 'Production Costs', 'Get Custom Quote'],
        intent: 'pricing_inquiry',
        confidence: 0.8
      };
    }
    
    // Default response
    return {
      content: "Thanks for reaching out! I'm here to help with all things Soundzy World Global.\n\nWe offer: DJ services, Creative design & branding, Equipment shop & installation.\n\nWhatsApp: +2348166687167\nEmail: soundzybeatz@gmail.com\n\nWhat interests you most?",
      quickReplies: ['Book DJ', 'Shop Equipment', 'Creative Services', 'Play Music'],
      intent: 'general_inquiry',
      confidence: 0.6
    };
  };

  return {
    sendMessage,
    generateSessionId,
    isLoading
  };
}