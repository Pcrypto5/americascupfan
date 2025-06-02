// server.cjs (versione con debug migliorato)
require("dotenv").config();
const express = require("express");
const fs = require("fs");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const axios = require("axios");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

const FILE_PATH = path.join(__dirname, "subscribers.json");
const BASE_URL = process.env.BASE_URL || "http://localhost:8080";


// Debug: log delle variabili d'ambiente all'avvio
console.log("🔧 Environment check:");
console.log("- BASE_URL:", BASE_URL);
console.log("- BREVO_API_KEY:", process.env.BREVO_API_KEY ? "✅ Set" : "❌ Missing");
console.log("- FILE_PATH:", FILE_PATH);

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

function writeData(data) {
  try {
    fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2));
    console.log(`💾 Saved ${data.length} subscribers to file`);
  } catch (err) {
    console.error("❌ Error writing to subscribers.json:", err);
    throw err;
  }
}

// Endpoint per vedere tutti i subscribers (solo per debug)
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
        <a href='${BASE_URL}/confirm/${token}' style='background-color: #0066cc; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;'>Confirm Subscription</a>
        <br><br>
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
    console.error("❌ Error in subscription process:");

    if (error.response) {
      console.error("Brevo API error:", {
        status: error.response.status,
        data: error.response.data
      });
      res.status(500).json({ 
        error: "Failed to send confirmation email",
        details: error.response.data
      });
    } else if (error.code === 'ENOENT' || error.message.includes('ENOENT')) {
      console.error("File system error:", error.message);
      res.status(500).json({ 
        error: "Failed to save subscription data",
        details: "File system not writable"
      });
    } else {
      console.error("Generic error:", error.message);
      res.status(500).json({ 
        error: "Internal server error",
        details: error.message
      });
    }
  }
});

app.get("/confirm/:token", (req, res) => {
  const { token } = req.params;
  console.log("🔗 Confirmation request for token:", token);

  const data = readData();
  const user = data.find(u => u.token === token);

  if (!user) {
    console.log("❌ Invalid token:", token);
    return res.status(404).send(`
      <h2>Invalid or expired confirmation link</h2>
      <p>This confirmation link is not valid. Please try subscribing again.</p>
    `);
  }

  if (user.confirmed) {
    console.log("⚠️ User already confirmed:", user.email);
    return res.send(`
      <h2>Already confirmed!</h2>
      <p>Hi ${user.firstName}, your subscription was already confirmed.</p>
    `);
  }

  user.confirmed = true;
  user.confirmedAt = new Date().toISOString();
  writeData(data);

  console.log("✅ User confirmed:", user.email);

  res.send(`
    <h2>Thank you ${user.firstName}!</h2>
    <p>Your subscription to America's Cup Fan newsletter is now confirmed.</p>
    <p>You'll start receiving our updates soon!</p>
  `);
});

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



// Export necessario per Railway
module.exports = app;
