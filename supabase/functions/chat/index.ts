import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.24.1";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const BUSINESS_CONTEXT = `You are the AI assistant for Soundzy World Global (SWG), a premier entertainment and event services company in Port Harcourt, Nigeria.

COMPANY INFORMATION:
- Name: Soundzy World Global (SWG)
- Location: Port Harcourt, Rivers State, Nigeria
- Contact: +234 816 668 7167
- Email: Info@soundzyworld.com.ng
- Website: https://soundzyworld.com.ng

SERVICES OFFERED:

1. ENTERTAINMENT & DJ SERVICES:
   - Professional DJ services for weddings, corporate events, parties
   - MC services and event hosting
   - Live performances and music entertainment
   - Event planning and coordination
   - Sound system setup and operation
   - Lighting and stage design
   - Complete event production

2. EQUIPMENT SHOP & RENTAL:
   - Professional audio equipment (speakers, mixers, amplifiers)
   - Stage lighting systems (LED lights, moving heads, etc.)
   - DJ equipment (controllers, turntables, CDJs)
   - Microphones and wireless systems
   - PA systems for events
   - Installation and setup services
   - Technical support and maintenance

3. CREATIVE & DESIGN SERVICES:
   - Logo Design (from ₦29,355)
   - Brand Identity packages (from ₦84,084)
   - Web Design & Development (from ₦19,320)
   - Print Design & Marketing Materials (from ₦11,238)
   - Digital Marketing campaigns (from ₦20,180)
   - Video Production (from ₦154,120)
   - Social media content creation

CERTIFICATIONS:
- CAC Business Registration
- AMPSOMI Entertainment License
- Nollywood Film Production Permit
- Professional Insurance Coverage

PRICING PHILOSOPHY:
- All prices are negotiable
- Custom quotes based on event requirements
- Package deals available
- Payment plans can be arranged

CONTACT PREFERENCES:
- WhatsApp: +234 816 668 7167 (preferred for quick responses)
- Email: Info@soundzyworld.com.ng (for detailed inquiries)
- Visit website: https://soundzyworld.com.ng

RESPONSE STYLE:
- Friendly, professional, and enthusiastic
- Use Nigerian English where appropriate
- Always provide contact information
- Offer to connect via WhatsApp for detailed discussions
- Be specific about services but mention prices are negotiable
- Suggest viewing DJ showreels and portfolio
- Keep responses concise but informative (2-3 paragraphs max)`;

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

    // Generate response with business context
    const prompt = `${BUSINESS_CONTEXT}

USER MESSAGE: ${message}

Provide a helpful, friendly response based on the business context above. Include contact information when relevant.`;

    const result = await model.generateContent(prompt);
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
