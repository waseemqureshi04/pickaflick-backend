// src/index.js
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // ==========================================
    // 🛡️ 1. CORS CONFIGURATION
    // ==========================================
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*", // Or specific domains like "https://pickaflick.live"
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };

    // Handle Preflight (OPTIONS) requests immediately
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    // ==========================================
    // 🎬 2. TMDB ROUTE
    // Path: /api/tmdb/...
    // ==========================================
    if (url.pathname.startsWith("/api/tmdb")) {
      // Remove "/api/tmdb" to get the real TMDB path (e.g., /movie/now_playing)
      const tmdbPath = url.pathname.replace("/api/tmdb", "");
      const tmdbUrl = `https://api.themoviedb.org/3${tmdbPath}${url.search}`;

      try {
        const tmdbResponse = await fetch(tmdbUrl, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${env.TMDB_KEY}`, // Access env var
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
            "Authorization": `Bearer ${env.OPENAI_KEY}`,
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

    // 404 for unknown routes
    return new Response("Not Found", { status: 404, headers: corsHeaders });
  },
};