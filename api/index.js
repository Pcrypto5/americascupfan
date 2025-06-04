// api/index.js (ESM)
import dotenv from "dotenv";
import express from "express";
import fs from "fs";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

// ==========================================
//  1) CONFIGURAZIONE AMBIENTE
// ==========================================
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Carica le variabili da .env
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Percorso file subscribers.json (nella cartella api/)
const FILE_PATH = path.join(__dirname, "subscribers.json");

// BASE_URL usata all’interno delle email (fallback in locale se non definita)
const BASE_URL = process.env.BASE_URL || "http://localhost:8080";

// Debug: a ogni avvio stampo le variabili essenziali
console.log("🔧 Environment check:");
console.log("- BASE_URL:", BASE_URL);
console.log("- BREVO_API_KEY:", process.env.BREVO_API_KEY ? "✅ Set" : "❌ Missing");
console.log("- FILE_PATH:", FILE_PATH);

// ==========================================
//  2) FUNZIONI DI SEMPLICE I/O SU FILE
// ==========================================
function readData() {
  try {
    if (!fs.existsSync(FILE_PATH)) {
      // Se non esiste ancora il file, inizializzo con un array vuoto
      console.log("📄 subscribers.json doesn't exist yet. Creating a new, empty array");
      return [];
    }
    const raw = fs.readFileSync(FILE_PATH, "utf-8");
    const data = JSON.parse(raw);
    console.log(`📄 Letti ${data.length} subscriber dalla memoria`);
    return data;
  } catch (err) {
    console.error("❌ Errore durante la lettura di subscribers.json:", err);
    // Se dovesse fallire, torno array vuoto in modo da non bloccare del tutto l’app
    return [];
  }
}

function writeData(data) {
  try {
    fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2));
    console.log(`💾 Salvati ${data.length} subscriber su subscribers.json`);
  } catch (err) {
    console.error("❌ Errore durante la scrittura di subscribers.json:", err);
    throw err;
  }
}

// ==========================================
//  3) ENDPOINT PUBBLICI
// ==========================================

// GET /api/subscribers
// Restituisce la lista di tutti i subscriber (compresa la proprietà "interests").
app.get("/api/subscribers", (req, res) => {
  const data = readData();
  // Mappo solo i campi necessari alla risposta
  const resp = {
    count: data.length,
    subscribers: data.map((s) => ({
      email: s.email,
      confirmed: s.confirmed,
      timestamp: s.timestamp,
      interests: s.interests  // restituisco anche le preferenze
    }))
  };
  return res.json(resp);
});

// POST /api/subscribe
// Riceve { firstName, lastName, email, interests } e salva su file + invia email di conferma
app.post("/api/subscribe", async (req, res) => {
  console.log("📨 Nuova richiesta di iscrizione:", req.body);
  const { firstName, lastName, email, interests } = req.body;

  // VALIDAZIONE SEMPLICE: i 3 campi principali non devono essere vuoti
  if (!firstName || !lastName || !email) {
    console.log("❌ Mancano campi obbligatori");
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Genero token e timestamp
  const token = uuidv4();
  const timestamp = new Date().toISOString();

  // Creo l’oggetto subscriber
  const newSubscriber = {
    firstName,
    lastName,
    email,
    interests: Array.isArray(interests) ? interests : [],  // assicuro array
    confirmed: false,
    token,
    timestamp,
  };

  try {
    // Leggo il file
    const data = readData();

    // Se l’email esiste già, RESTITUISCO 400
    const existingUser = data.find((user) => user.email === email);
    if (existingUser) {
      console.log("⚠️ Email già presente:", email);
      return res.status(400).json({ error: "Email already registered" });
    }

    // Aggiungo il nuovo subscriber all’array e riscrivo su file
    data.push(newSubscriber);
    writeData(data);
    console.log("✅ Subscriber salvato localmente");

    // Inizio invio email di conferma
    console.log("📧 Invio email di conferma via Brevo…");
    await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: { 
          name: "America's Cup Fans", 
          email: "infonews@bstac.tech"  // <– Usa qui il mittente che hai già verificato
        },
        to: [
          {
            email,
            name: `${firstName} ${lastName}`
          }
        ],
        subject: "Conferma la tua iscrizione!",
        htmlContent: `
          <h3>Ciao ${firstName}!</h3>
          <p>Grazie per esserti iscritto alla newsletter di America’s Cup Fan.</p>
          <p>Le tue preferenze di interesse selezionate sono:</p>
          <ul>
            ${
              newSubscriber.interests.length > 0
                ? newSubscriber.interests.map((i) => `<li>${i}</li>`).join("")
                : "<li>(Nessun interesse selezionato)</li>"
            }
          </ul>
          <p>Per confermare l’iscrizione, clicca qui sotto:</p>
          <p>
            <a href="${BASE_URL}/confirm/${token}"
               style="display:inline-block;padding:10px 20px;background-color:#0066cc;color:#fff;text-decoration:none;border-radius:4px;">
              Conferma Iscrizione
            </a>
          </p>
          <p>Se il pulsante non funziona, copia questo link nel tuo browser:</p>
          <p><small>${BASE_URL}/confirm/${token}</small></p>
        `,
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("✅ Brevo email inviata con successo");

    // Rispondo 200 con messaggio di debug
    return res.status(200).json({
      message: "Confirmation email sent.",
      debug: {
        saved: true,
        emailSent: true,
        subscribersCount: data.length,
      },
    });
  } catch (error) {
    console.error("❌ Errore nel processo di iscrizione:", error);
    // Se Brevo restituisce un errore, lo catturo e resto 500
    if (error.response) {
      console.error("Brevo API error:", {
        status: error.response.status,
        data: error.response.data,
      });
      return res.status(500).json({
        error: "Failed to send confirmation email",
        details: error.response.data,
      });
    }
    // Altrimenti errore generico
    return res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
});

// GET /confirm/:token
// Conferma via token, aggiorna confirmed = true e salva su file
app.get("/confirm/:token", (req, res) => {
  const { token } = req.params;
  console.log("🔗 Richiesta di conferma per token:", token);

  const data = readData();
  const user = data.find((u) => u.token === token);
  if (!user) {
    console.log("❌ Token non valido:", token);
    return res.status(404).send(`
      <h2>Link di conferma non valido o scaduto</h2>
      <p>Riprova a registrarti nuovamente.</p>
    `);
  }
  if (user.confirmed) {
    console.log("⚠️ Utente già confermato:", user.email);
    return res.send(`
      <h2>Hai già confermato!</h2>
      <p>Ciao ${user.firstName}, il tuo account era già stato confermato.</p>
    `);
  }

  // Segno confirmed = true e salvo la data
  user.confirmed = true;
  user.confirmedAt = new Date().toISOString();
  writeData(data);
  console.log("✅ Utente confermato correttamente:", user.email);

  // Risposta HTML semplice di conferma
  return res.send(`
    <h2>Grazie ${user.firstName}!</h2>
    <p>La tua iscrizione è ora confermata. Riceverai presto le nostre email.</p>
  `);
});

// GET /health
// Solo un endpoint di health-check per verificare lo stato del server
app.get("/health", (req, res) => {
  const data = readData();
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    subscribersCount: data.length,
    environment: {
      baseUrl: BASE_URL,
      hasBrevoKey: !!process.env.BREVO_API_KEY,
    },
  });
});

// ==========================================
//  4) ESPORTO IL SERVER PER server.js
// ==========================================
export default app;
