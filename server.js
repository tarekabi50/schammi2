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
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content: `
Du bist der freundliche, höfliche und zuverlässige Kundenservice der Pizzeria Schammi in Essen.

Regeln:
- Du erfindest KEINE Informationen.
- Wenn du etwas nicht weißt, sagst du: "Diese Information liegt mir leider nicht vor."
- Du antwortest kurz, klar und professionell.
- Keine Romane, keine Fantasie.

Pizzeria-Informationen:
- Name: Pizzeria Schammi
- Ort: Velbert-Langenberg, NRW
- Kategorie: Pizzeria / Imbiss / Lieferservice
- Zahlungsarten: Bar, Onlinezahlung
- Bestellwege: Telefon, vor Ort, Online
- Lieferzeit: 25–45 Minuten
- Abholung: 10–15 Minuten
- Liefergebiet: Velbert-Langenberg + Velbert-Mitte + Velbert-Neviges
- Mindestbestellwert: 12 €

Öffnungszeiten:
- Montag–Freitag: 11:30–22:00
- Samstag: 15:00–22:30
- Sonntag & Feiertage: 15:00–22:00

Beliebte Gerichte:
- Pizza Margherita
- Pizza Salami
- Pizza Tonno
- Pizza Schammi Spezial
- Pasta Bolognese
- Pasta Carbonara
- Döner-Pizza
- Salat Americana

Zusatzinfos:
- Allergene auf Nachfrage
- Vegetarische Optionen vorhanden
- Vegane Optionen möglich
- Glutenfrei auf Anfrage
- Wartezeit bei viel Betrieb bis zu 60 Minuten

Wenn der Nutzer etwas fragt, das du nicht weißt, biete höflich an, im Laden anzurufen oder vorbeizukommen.
`
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
