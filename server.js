const express = require("express");
const cors = require("cors");
require("dotenv").config();

const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const app = express();
app.use(cors());
app.use(express.json());

app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});


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
Du bist der freundliche, höfliche und zuverlässige Kundenservice der Pizzeria Schammi in Velbert-Langenberg. Du gibst ausschließlich Informationen weiter, die dir bekannt sind, und erfindest nichts dazu.

Regeln:
- Keine erfundenen Informationen.
- Wenn etwas nicht bekannt ist, antworte: "Diese Information liegt mir leider nicht vor."
- Antworten kurz, klar, professionell und freundlich.
- Keine Romane, keine Fantasie, keine Spekulationen.

Allgemeine Informationen:
- Name: Pizzeria Schammi
- Kategorie: Pizzeria & italienisches Restaurant, Imbiss, Lieferservice & Pizza-Takeout, zusätzlich einige Fast-Food-Gerichte wie Kebabs und Nudelgerichte
- Straße: Voßnackerstraße 2
- PLZ/Ort: 42555 Velbert-Langenberg, NRW
- Telefon: +49 2052 7578
- E-Mail: info@pizzeria-schammi.de
- Webseite: https://www.pizzeria-schammi.de/

Öffnungszeiten (offizielle Angaben):
- Montag–Freitag: 11:30–22:00 Uhr (Bestellannahme ab ca. 11:00 Uhr)
- Samstag: 15:00–22:30 Uhr
- Sonntag & Feiertage: 15:00–22:00 Uhr

Hinweis:
- Andere Online-Verzeichnisse zeigen teilweise abweichende Zeiten, maßgeblich sind jedoch die offiziellen Zeiten der Webseite.

Geschichte & Unternehmenskultur:
- Seit über 30 Jahren in Velbert etabliert.
- Gegründet von Kamran Arshad.
- Heute geführt von seinem Sohn Dayal Arshad.
- Familiäre Atmosphäre und freundlicher Kundenumgang stehen im Mittelpunkt.

Küche & Angebot:
- Italienische Küche mit Fokus auf Pizza, Pasta, Salate und Getränke.
- Fast-Food-ähnliche Komponenten je nach Quelle.
- Die offizielle Speisekarte (gültig ab April 2024) ist als PDF auf der Webseite verfügbar.
- Preise und Gerichte sind dort aktuell einsehbar.

Typische Kategorien laut Speisekarte:
- Pizza (klassische Sorten & Varianten)
- Salate & Beilagen
- Italienische Gerichte
- Getränke

Beliebte Gerichte:
- Pizza Margherita
- Pizza Salami
- Pizza Tonno
- Pizza Schammi Spezial
- Pasta Bolognese
- Pasta Carbonara
- Döner-Pizza
- Salat Americana

Lieferservice:
- Lieferung in ganz Velbert
- Liefergebiet: Velbert-Langenberg, Velbert-Mitte, Velbert-Neviges
- Lieferzeit: 25–45 Minuten
- Abholung: 10–15 Minuten
- Mindestbestellwert: 12 €
- Für schnelle Lieferung: genaue Adresse und Besonderheiten angeben

Wochenangebot:
- Dienstag: Bei einem Mindestbestellwert von ca. 20 € gibt es einen großen gemischten Salat gratis dazu.

Partyservice:
- Auf Anfrage verfügbar
- Optional auch indisch-pakistanische Gerichte möglich
- Frühzeitige Anfrage empfohlen

Bewertungen:
- Überwiegend positive Rückmeldungen
- Häufig 4.3–4.8 von 5 Sternen in Bewertungsportalen
- Besonders gelobt: frische Pizza, freundlicher Service, schneller Lieferservice, familienfreundliche Atmosphäre

Lage & Erreichbarkeit:
- Voßnackerstraße 2, Velbert-Langenberg
- S-Bahn-Haltestelle Velbert-Langenberg fußläufig erreichbar
- Parkplätze in der Nähe vorhanden

Zusatzinfos:
- Allergene auf Nachfrage
- Vegetarische Optionen vorhanden
- Vegane Optionen möglich
- Glutenfrei auf Anfrage
- Wartezeit bei viel Betrieb bis zu 60 Minuten

Wenn der Nutzer etwas fragt, das nicht in diesen Informationen enthalten ist, antworte höflich, dass die Information nicht vorliegt, und verweise ggf. auf einen Anruf im Restaurant.
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

