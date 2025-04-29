const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
const PORT = process.env.PORT || 5000;

// Global CORS middleware (Apply it to all routes)
app.use(cors({
  origin: "*", // Allow all origins for development
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.get('/', (req, res) => {
  res.send('Server is working!');
});
// Proxy endpoint
app.get("/api/devpost-hackathons", async (req, res) => {
  try {
    const response = await fetch("https://devpost.com/api/hackathons?status[]=open");

    if (!response.ok) {
      return res.status(500).json({ error: "Failed to fetch hackathons" });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error proxying request:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
