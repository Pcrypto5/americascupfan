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

// Serve static React frontend from dist/
app.use("/", express.static(path.join(__dirname, "../dist")));

const FILE_PATH = path.join(__dirname, "subscribers.json");
const BASE_URL = process.env.BASE_URL || "http://localhost:8080";

// ✅ Debug env
console.log("🔧 Environment check:");
console.log("- BASE_URL:", BASE_URL);
console.log("- BREVO_API_KEY:", process.env.BREVO_API_KEY ? "✅ Set" : "❌ Missing");
console.log("- FILE_PATH:", FILE_PATH);

// Lettura da file
function readData() {
  try {
    if (!fs.existsSync(FILE_PATH)) {
      console.log("📄 subscribers.json doesn't exist, creating empty array");
      return [];
    }
    const data = JSON.parse(fs.readFileSync(FILE_PATH, "utf-8"));
    console.log(`📄 Read ${data.length} subscribers from file`);
    return data;
  } catch (err) {
    console.error("❌ Error reading subscribers.json:", err);
    return [];
  }
}

// Scrittura su file
function writeData(data) {
  try {
    fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2));
    console.log(`💾 Saved ${data.length} subscribers to file`);
  } catch (err) {
    console.error("❌ Error writing to subscribers.json:", err);
    throw err;
  }
}

// GET /api/subscribers
app.get("/api/subscribers", (req, res) => {
  const data = readData();
  res.json({
    count: data.length,
    subscribers: data.map(s => ({
      email: s.email,
      confirmed: s.confirmed,
      timestamp: s.timestamp
    }))
  });
});

// POST /api/subscribe
app.post("/api/subscribe", async (req, res) => {
  console.log("📨 New subscription request:", req.body);

  const { firstName, lastName, email, interests } = req.body;

  if (!firstName || !lastName || !email) {
    console.log("❌ Missing required fields");
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
    const existingUser = data.find(user => user.email === email);
    if (existingUser) {
      console.log("⚠️ Email already exists:", email);
      return res.status(400).json({ error: "Email already registered" });
    }

    data.push(newSubscriber);
    writeData(data);

    console.log("✅ Subscriber saved locally");
    console.log("📧 Sending confirmation email via Brevo...");

    await axios.post("https://api.brevo.com/v3/smtp/email", {
      sender: {
        name: "America's Cup Fans",
        email: "noreply@americascupfan.com"
      },
      to: [{
        email,
        name: `${firstName} ${lastName}`
      }],
      subject: "Please confirm your subscription",
      htmlContent: `
        <h3>Welcome aboard, ${firstName}!</h3>
        <p>Thank you for subscribing to America's Cup Fan newsletter.</p>
        <p>Click the link below to confirm your subscription:</p>
        <a href='${BASE_URL}/confirm/${token}' style='background-color: #0066cc; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;'>Confirm Subscription</a>
        <p><small>If the button doesn't work, copy and paste this link: ${BASE_URL}/confirm/${token}</small></p>
      `,
    }, {
      headers: {
        "api-key": process.env.BREVO_API_KEY,
        "Content-Type": "application/json"
      }
    });

    console.log("✅ Brevo email sent successfully");
    res.status(200).json({
      message: "Confirmation email sent.",
      debug: {
        saved: true,
        emailSent: true,
        subscribersCount: data.length
      }
    });

  } catch (error) {
    console.error("❌ Error in subscription process:", error);
    if (error.response) {
      res.status(500).json({
        error: "Failed to send confirmation email",
        details: error.response.data
      });
    } else {
      res.status(500).json({
        error: "Internal server error",
        details: error.message
      });
    }
  }
});

// Conferma via token
app.get("/confirm/:token", (req, res) => {
  const { token } = req.params;
  console.log("🔗 Confirmation request for token:", token);

  const data = readData();
  const user = data.find(u => u.token === token);

  if (!user) {
    return res.status(404).send(`
      <h2>Invalid or expired confirmation link</h2>
      <p>This confirmation link is not valid. Please try subscribing again.</p>
    `);
  }

  if (user.confirmed) {
    return res.send(`
      <h2>Already confirmed!</h2>
      <p>Hi ${user.firstName}, your subscription was already confirmed.</p>
    `);
  }

  user.confirmed = true;
  user.confirmedAt = new Date().toISOString();
  writeData(data);

  res.send(`
    <h2>Thank you ${user.firstName}!</h2>
    <p>Your subscription to America's Cup Fan newsletter is now confirmed.</p>
    <p>You'll start receiving our updates soon!</p>
  `);
});

// Health check
app.get("/health", (req, res) => {
  const data = readData();
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    subscribersCount: data.length,
    environment: {
      baseUrl: BASE_URL,
      hasBrevoKey: !!process.env.BREVO_API_KEY
    }
  });
});

// Exporta per server.js
export default app;
