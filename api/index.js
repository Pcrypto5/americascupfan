// api/index.js (modulo ESM)
import dotenv from "dotenv";
import express from "express";
import fs from "fs";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const FILE_PATH = path.join(__dirname, "subscribers.json");
const BASE_URL = process.env.BASE_URL || "http://localhost:8080";

// Debug all’avvio
console.log("🔧 Environment check:");
console.log("- BASE_URL:", BASE_URL);
console.log("- BREVO_API_KEY:", process.env.BREVO_API_KEY ? "✅ Set" : "❌ Missing");
console.log("- FILE_PATH:", FILE_PATH);

function readData() {
  try {
    if (!fs.existsSync(FILE_PATH)) {
      console.log("📄 subscribers.json non esiste, creo un array vuoto");
      return [];
    }
    const data = JSON.parse(fs.readFileSync(FILE_PATH, "utf-8"));
    console.log(`📄 Letti ${data.length} subscribers da file`);
    return data;
  } catch (err) {
    console.error("❌ Errore lettura subscribers.json:", err);
    return [];
  }
}

function writeData(data) {
  try {
    fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2));
    console.log(`💾 Salvati ${data.length} subscribers su file`);
  } catch (err) {
    console.error("❌ Errore scrittura su subscribers.json:", err);
    throw err;
  }
}

// **Debug endpoint** per vedere tutti i subscribers
app.get("/api/subscribers", (req, res) => {
  const data = readData();
  res.json({
    count: data.length,
    subscribers: data.map(s => ({
      email: s.email,
      confirmed: s.confirmed,
      timestamp: s.timestamp,
      //token: s.token         // <--- ora includiamo anche il token
      
    }))
  });
});

app.post("/api/subscribe", async (req, res) => {
  console.log("📨 New subscription request:", req.body);
  const { firstName, lastName, email, interests } = req.body;

  if (!firstName || !lastName || !email) {
    console.log("❌ Mancano campi obbligatori");
    return res.status(400).json({ error: "Missing required fields" });
  }

  const token = uuidv4();
  const timestamp = new Date().toISOString();
  const newSubscriber = {
    firstName,
    lastName,
    email,
    interests: interests || [],
    confirmed: false,
    token,
    timestamp,
  };

  try {
    const data = readData();
    const existingUser = data.find((u) => u.email === email);
    if (existingUser) {
      console.log("⚠️ Email già esistente:", email);
      return res.status(400).json({ error: "Email already registered" });
    }

    data.push(newSubscriber);
    writeData(data);
    console.log("✅ Subscriber salvato localmente");

    // Invia email via Brevo
    console.log("📧 Invio email di conferma via Brevo...");
    await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "America's Cup Fans",
          email: "infonews@bstac.tech",
        },
        to: [
          {
            email,
            name: `${firstName} ${lastName}`,
          },
        ],
        subject: "Please confirm your subscription",
        htmlContent: `
          <h3>Welcome aboard, ${firstName}!</h3>
          <p>Thank you for subscribing to America's Cup Fan newsletter.</p>
          <p>Click the link below to confirm your subscription:</p>
          <a href='${BASE_URL}/confirm/${token}' style='background-color: #0066cc; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;'>Confirm Subscription</a>
          <p><small>If the button doesn't work, copia e incolla questo link: ${BASE_URL}/confirm/${token}</small></p>
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
    return res.status(200).json({
      message: "Confirmation email sent.",
      debug: {
        saved: true,
        emailSent: true,
        subscribersCount: data.length,
      },
    });
  } catch (error) {
    console.error("❌ Errore nella subscription:", error);
    if (error.response) {
      return res
        .status(500)
        .json({ error: "Failed to send confirmation email", details: error.response.data });
    } else {
      return res
        .status(500)
        .json({ error: "Internal server error", details: error.message });
    }
  }
});

app.get("/confirm/:token", (req, res) => {
  const { token } = req.params;
  console.log("🔗 Richiesta conferma per token:", token);
  const data = readData();
  const user = data.find((u) => u.token === token);

  if (!user) {
    return res.status(404).send(`
      <h2>Invalid or expired confirmation link</h2>
      <p>Il link di conferma non è valido. Iscriviti di nuovo.</p>
    `);
  }

  if (user.confirmed) {
    return res.send(`
      <h2>Already confirmed!</h2>
      <p>Hi ${user.firstName}, la tua subscription era già confermata.</p>
    `);
  }

  user.confirmed = true;
  user.confirmedAt = new Date().toISOString();
  writeData(data);

  return res.send(`
    <h2>Grazie ${user.firstName}!</h2>
    <p>La tua subscription è ora confermata. Riceverai presto le nostre email!</p>
  `);
});

app.get("/health", (req, res) => {
  const data = readData();
  return res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    subscribersCount: data.length,
    environment: {
      baseUrl: BASE_URL,
      hasBrevoKey: !!process.env.BREVO_API_KEY,
    },
  });
});

// Non chiudere con app.listen qui (lo facciamo in server.js)
export default app;
