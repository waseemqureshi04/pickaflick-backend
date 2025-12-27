const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
const PORT = 3002;

// Load keys from environment variables
const TMDB_API_KEY = process.env.TMDB_KEY;
const OPENAI_API_KEY = process.env.OPENAI_KEY;

// ==========================================
// 🔒 SECURITY LAYER 1: STRICT CORS
// ==========================================
const allowedOrigins = [
  "https://pickaflick.live",
  "https://www.pickaflick.live",
  "http://localhost:5173", // Local testing
  "http://localhost:3002"  // Local testing
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, or Postman)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error('🚫 CORS Policy: Access denied from this origin.'), false);
    }
    return callback(null, true);
  }
}));

// ==========================================
// 🔒 SECURITY LAYER 2: DIRECT ACCESS BLOCK
// ==========================================
// This prevents users from opening the API in a browser tab
app.use((req, res, next) => {
  // If a browser tries to load the page (accepts HTML) but has no "Origin" or "Referer"
  // it means the user typed the URL manually. Block them.
  if (req.accepts('html') && !req.get('origin') && !req.get('referer')) {
    return res.status(403).send("<h1>🚫 Access Denied</h1><p>You cannot access this API directly. Please use the <a href='https://pickaflick.live'>Pickaflick Website</a>.</p>");
  }
  next();
});

app.use(bodyParser.json());

// ==========================================
// 🎬 TMDB PROXY ROUTE
// ==========================================
app.use("/api/tmdb", async (req, res) => {
  try {
    const path = req.path.slice(1); 
    const query = req.url.split("?")[1] || "";
    const url = `https://api.themoviedb.org/3/${path}?${query}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${TMDB_API_KEY}`,
      },
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("TMDB fetch error:", err.message);
    res.status(500).json({ error: "Failed to fetch TMDB data" });
  }
});

// ==========================================
// 🤖 GPT PROXY ROUTE
// ==========================================
app.post("/api/gpt", async (req, res) => {
  try {
    const { messages } = req.body;
    const url = "https://api.openai.com/v1/chat/completions";

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages,
      }),
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("OpenAI fetch error:", err.message);
    res.status(500).json({ error: "Failed to fetch from OpenAI" });
  }
});

// Health check route
app.get("/", (req, res) => {
  res.send("Pickaflick Backend is running on EC2 + Podman!");
});

app.listen(PORT, () => {
});