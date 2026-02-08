const express = require("express");
const cors = require("cors");
require("dotenv").config();

const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const app = express();
app.use(cors());
app.use(express.json());

const GROQ_KEY = process.env.KEY;
console.log("KEY:", GROQ_KEY);

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROQ_KEY}`
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [
          {
            role: "system",
            content:
              "Du bist der freundliche Kundenservice der Pizzeria Schammi. Du beantwortest Fragen zu Öffnungszeiten, Lieferung, Adresse und Gerichten."
          },
          { role: "user", content: userMessage }
        ]
      })
    });

    const data = await response.json();
    console.log("GROQ ANTWORT:", data);

    if (!data.choices) {
      return res.json({
        reply: "Fehler von Groq: " + JSON.stringify(data)
      });
    }

    res.json({ reply: data.choices[0].message.content });

  } catch (error) {
    console.log("FEHLER:", error);
    res.json({
      reply: "Entschuldigung, gerade ist ein Fehler aufgetreten."
    });
  }
});

app.listen(3000, () => {
  console.log("✅ KI-Server läuft auf http://localhost:3000");
});


