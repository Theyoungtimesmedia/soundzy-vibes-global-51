import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.24.1";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const BUSINESS_INFO = {
  company: "Soundzy World Global (SWG)",
  location: "Port Harcourt, Rivers State, Nigeria",
  phone: "+234 816 668 7167",
  email: "Info@soundzyworld.com.ng",
  website: "https://soundzyworld.com.ng",
  
  services: {
    dj: ["weddings", "corporate events", "parties", "MC services", "event planning"],
    equipment: ["audio equipment", "stage lighting", "DJ gear", "microphones", "PA systems", "rentals"],
    creative: ["logo design", "brand identity", "web design", "print design", "digital marketing", "video production"]
  },
  
  pricing: {
    logo: "from ₦29,355",
    branding: "from ₦84,084",
    web: "from ₦19,320",
    print: "from ₦11,238",
    marketing: "from ₦20,180",
    video: "from ₦154,120"
  }
};

const SYSTEM_PROMPT = `You are a friendly customer service assistant for Soundzy World Global (SWG), an entertainment and event services company in Port Harcourt, Nigeria.

YOUR ROLE:
- Be conversational, helpful, and human-like
- Answer questions naturally without dumping all information at once
- Only provide specific details when asked or relevant
- Guide users to the right service based on their needs

AVAILABLE SERVICES:
1. DJ & Entertainment (weddings, events, parties)
2. Equipment Shop & Rental (audio, lighting, DJ gear)
3. Creative Services (design, web, video, marketing)

IMPORTANT GUIDELINES:
- Keep responses concise (1-2 short paragraphs)
- Don't list all services unless asked
- Only mention pricing if specifically asked about costs
- Provide contact details (WhatsApp: +234 816 668 7167, Email: Info@soundzyworld.com.ng) ONLY when:
  * User asks how to reach out
  * You cannot answer their specific question
  * User wants to book or get a detailed quote
  * Conversation naturally leads to next steps

Be natural and conversational - you're chatting, not presenting a brochure.`;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, sessionId } = await req.json();

    if (!message || !sessionId) {
      return new Response(
        JSON.stringify({ error: 'Message and sessionId are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Save user message to database
    const { error: saveError } = await supabase
      .from('chat_messages')
      .insert({
        session_id: sessionId,
        direction: 'inbound',
        message: message,
        metadata: {
          timestamp: new Date().toISOString(),
          source: 'chat_widget'
        }
      });

    if (saveError) {
      console.error('Error saving user message:', saveError);
    }

    // Initialize Gemini AI
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiApiKey) {
      throw new Error('GEMINI_API_KEY not configured');
    }

    const genAI = new GoogleGenerativeAI(geminiApiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    // Generate response with smart context
    const result = await model.generateContent([
      { text: SYSTEM_PROMPT },
      { text: `User: ${message}\nAssistant:` }
    ]);
    const response = result.response;
    const responseText = response.text();

    // Determine intent and quick replies based on message content
    const lowerMessage = message.toLowerCase();
    let intent = 'general_inquiry';
    let quickReplies = ['Book DJ', 'Shop Equipment', 'Creative Services', 'Contact Us'];
    let confidence = 0.6;

    if (lowerMessage.includes('book') || lowerMessage.includes('dj') || lowerMessage.includes('event')) {
      intent = 'booking_inquiry';
      quickReplies = ['Share Event Details', 'WhatsApp Me', 'View DJ Showreels', 'Get Quote'];
      confidence = 0.9;
    } else if (lowerMessage.includes('shop') || lowerMessage.includes('gear') || lowerMessage.includes('equipment') || lowerMessage.includes('buy')) {
      intent = 'shop_inquiry';
      quickReplies = ['Browse Speakers', 'DJ Equipment', 'Stage Lights', 'Get Quote'];
      confidence = 0.85;
    } else if (lowerMessage.includes('creative') || lowerMessage.includes('design') || lowerMessage.includes('logo') || lowerMessage.includes('website') || lowerMessage.includes('video')) {
      intent = 'creative_inquiry';
      quickReplies = ['Logo Design', 'Web Design', 'Video Production', 'View Portfolio'];
      confidence = 0.85;
    } else if (lowerMessage.includes('showreel') || lowerMessage.includes('video') || lowerMessage.includes('tape') || lowerMessage.includes('music')) {
      intent = 'media_request';
      quickReplies = ['Play Flashback Mix', 'Weekend Vibes', 'View All Showreels', 'WhatsApp Me'];
      confidence = 0.95;
    } else if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('rate') || lowerMessage.includes('how much')) {
      intent = 'pricing_inquiry';
      quickReplies = ['DJ Pricing', 'Equipment Rates', 'Creative Services', 'Get Custom Quote'];
      confidence = 0.8;
    }

    // Save bot response to database
    const { error: saveResponseError } = await supabase
      .from('chat_messages')
      .insert({
        session_id: sessionId,
        direction: 'outbound',
        message: responseText,
        metadata: {
          intent,
          confidence,
          quick_replies: quickReplies,
          timestamp: new Date().toISOString(),
          model: 'gemini-2.0-flash-exp'
        }
      });

    if (saveResponseError) {
      console.error('Error saving bot response:', saveResponseError);
    }

    return new Response(
      JSON.stringify({
        response: responseText,
        quickReplies,
        intent,
        confidence
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Chat function error:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        response: "I apologize, but I'm having trouble processing your request right now. Please try contacting us directly via WhatsApp at +234 816 668 7167 or email Info@soundzyworld.com.ng"
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
