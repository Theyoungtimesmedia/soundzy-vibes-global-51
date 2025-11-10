import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { GoogleGenerativeAI } from "npm:@google/generative-ai@^0.24.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { contentType, contentData } = await req.json();
    
    if (!GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY not configured');
    }

    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    const prompt = `You are a UI layout designer. Based on the following ${contentType} content, generate an optimal UI layout configuration.

Content Data:
${JSON.stringify(contentData, null, 2)}

Generate a JSON object with the following structure for a ${contentType}:
{
  "layout": "card" | "featured" | "compact" | "grid-item",
  "theme": "default" | "vibrant" | "minimal" | "dark",
  "accentColor": "primary" | "secondary" | "accent" | "muted",
  "showMetadata": true | false,
  "animationStyle": "fade" | "slide" | "scale" | "none",
  "imagePosition": "top" | "left" | "right" | "background",
  "textAlignment": "left" | "center" | "right",
  "cardElevation": "none" | "sm" | "md" | "lg"
}

Consider:
- For videos: Choose layouts that emphasize thumbnails and video metadata
- For DJ tapes/audio: Focus on album art and playback controls
- Use vibrant themes for entertainment content
- Enable animations for engagement
- Optimize for mobile and desktop viewing

Return ONLY the JSON object, no additional text.`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    console.log('Gemini raw response:', text);

    // Parse the JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in response');
    }

    const uiVariant = JSON.parse(jsonMatch[0]);

    return new Response(
      JSON.stringify({ uiVariant }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in generate-ui-layout:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        uiVariant: {
          layout: 'card',
          theme: 'default',
          accentColor: 'primary',
          showMetadata: true,
          animationStyle: 'fade',
          imagePosition: 'top',
          textAlignment: 'left',
          cardElevation: 'md'
        }
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );
  }
});
