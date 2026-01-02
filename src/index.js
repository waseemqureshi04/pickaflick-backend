export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // ==========================================
    // 🛡️ 1. CORS CONFIGURATION
    // ==========================================
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*", 
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    // ==========================================
    // 🎬 2. TMDB ROUTE
    // Path: /api/tmdb/...
    // ==========================================
    if (url.pathname.startsWith("/api/tmdb")) {
      const tmdbPath = url.pathname.replace("/api/tmdb", "");
      const tmdbUrl = `https://api.themoviedb.org/3${tmdbPath}${url.search}`;

      try {
        const tmdbResponse = await fetch(tmdbUrl, {
          method: "GET",
          headers: {
            // 👇 HARDCODED KEY FOR TESTING 👇
            "Authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyM2ViM2QxYmQyYTg4N2NmYWZkMjQzOTEyZTc3YjAxNSIsIm5iZiI6MTc1MDI0NzAxMy41OTMsInN1YiI6IjY4NTJhNjY1MDFiY2NmMGRhODZhZWVlMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.GcMyI80nRRMjk6HoYQG6QicZJ6sPa1piSbkQORI-LX8",
            "Content-Type": "application/json",
          },
        });
        const data = await tmdbResponse.text();
        return new Response(data, { 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: "TMDB Fetch Failed" }), { status: 500, headers: corsHeaders });
      }
    }

    // ==========================================
    // 🤖 3. GPT ROUTE
    // Path: /api/gpt
    // ==========================================
    if (url.pathname === "/api/gpt" && request.method === "POST") {
      try {
        const body = await request.json();
        const openaiUrl = "https://api.openai.com/v1/chat/completions";

        const openaiResponse = await fetch(openaiUrl, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${env.OPENAI_KEY}`, // Leaving this one dynamic for now
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: body.messages,
          }),
        });

        const data = await openaiResponse.text();
        return new Response(data, { 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: "OpenAI Fetch Failed" }), { status: 500, headers: corsHeaders });
      }
    }

    return new Response("Not Found", { status: 404, headers: corsHeaders });
  },
};