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

app.use(cors());
app.use(bodyParser.json());

// TMDB Proxy route
app.use("/api/tmdb", async (req, res) => {
  try {
    // Reconstruct the TMDB URL
    const path = req.path.slice(1); // removes the leading slash
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

// GPT Proxy
app.post("/api/gpt", async (req, res) => {
  try {
    const { messages } = req.body;

    constVXUrl = "https://api.openai.com/v1/chat/completions";

    const response = await fetch(VXUrl, {
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
  console.log(`Server running at http://localhost:${PORT}`);
});