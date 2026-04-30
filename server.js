const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const response = await axios.post(
      'https://api.x.ai/v1/chat/completions',
      {
        model: "grok-beta",
        messages: [
          {
            role: "system",
            content: "You are MAICHAT, a friendly, warm and intelligent AI companion from Lagos, Nigeria. Be helpful and engaging."
          },
          {
            role: "user",
            content: message
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.GROK_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const aiReply = response.data.choices[0].message.content;

    res.json({ reply: aiReply });

  } catch (error) {
    console.error("Backend Error:", error.response?.data || error.message);
    res.status(500).json({ 
      error: "Sorry, MAICHAT is having trouble responding right now. Please try again later." 
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 MAICHAT Backend running on http://localhost:${PORT}`);
});
