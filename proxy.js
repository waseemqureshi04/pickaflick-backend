const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");
const bodyParser = require("body-parser");
const https = require("https");
const dns = require("dns");
const util = require("util");
require("dotenv").config();

const app = express();
const PORT = 3002;

const TMDB_API_KEY = process.env.TMDB_KEY;
const OPENAI_API_KEY = process.env.OPENAI_KEY;

dns.setServers(["1.1.1.1", "1.0.0.1"]);
const lookup = util.promisify(dns.lookup);
const ipCache = new Map();

const resolveWithCloudflare = async (hostname) => {
  if (ipCache.has(hostname)) return ipCache.get(hostname);
  const { address } = await lookup(hostname);
  ipCache.set(hostname, address);
  return address;
};

const createSecureAgent = (servername) => {
  return new https.Agent({
    servername,
    rejectUnauthorized: true,
  });
};

app.use(cors());
app.use(bodyParser.json());

// TMDB Proxy route
app.use("/api/tmdb", async (req, res) => {
  try {
    const path = req.path.slice(1);
    const query = req.url.split("?")[1] || "";
    const hostname = "api.themoviedb.org";
    const ip = await resolveWithCloudflare(hostname);

    const url = `https://${ip}/3/${path}?${query}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${TMDB_API_KEY}`,
        Host: hostname,
      },
      agent: createSecureAgent(hostname),
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
    const hostname = "api.openai.com";
    const ip = await resolveWithCloudflare(hostname);

    const response = await fetch(`https://${ip}/v1/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        Host: hostname,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages,
      }),
      agent: createSecureAgent(hostname),
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
  res.send("Pickaflick Backend is running on EC2 + Caddy !");
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
