import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are Soundzy Bot, the AI assistant for DJ Soundzy (aka Odogwu Na Vibes), a professional DJ and entertainer based in Port Harcourt, Nigeria.

Here are the services and pricing:
- Wedding DJ: from ₦50,000 (includes sound, lighting, stage setup)
- Corporate Events: from ₦80,000 (professional & polished)
- Club Night / Party: from ₦60,000 (high energy sets)
- MC / Hype Man: from ₦40,000 (crowd interaction & hosting)
- Live Sound Engineering: from ₦35,000 (pro audio management)
- Graphics & Logo Design: from ₦15,000 (logos, flyers & branding)
- Equipment Rental: from ₦20,000/day (PA systems, mics & lights)

Equipment available for sale/rent:
- Professional PA System: ₦450,000 (buy) / ₦20,000/day (rent)
- Wireless Microphone Set: ₦85,000 (buy) / ₦8,000/day (rent)
- LED Stage Light Kit: ₦120,000 (buy) / ₦15,000/day (rent)
- DJ Controller Pro: ₦280,000 (buy) / ₦25,000/day (rent)
- Complete Event Sound Package: ₦600,000 (buy) / ₦45,000/day (rent)
- Studio Recording Package: ₦195,000 (buy) / ₦18,000/day (rent)

Contact: WhatsApp +2348166687167
DJ Soundzy has 7+ years experience, 500+ events, serves 50,000+ fans.
Licensed for Nollywood productions and CAC registered.

Reply in a friendly, energetic tone with emojis. Keep answers short for mobile (2-3 sentences max).
For complex bookings, encourage the user to use the Book tab or message DJ Soundzy directly on WhatsApp.
Always be helpful and enthusiastic about music and events!`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again shortly." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please try again later." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI service unavailable" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("soundzy-ai error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
