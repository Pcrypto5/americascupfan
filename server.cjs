// server.cjs (CommonJS)
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

function readData() {
  try {
    if (!fs.existsSync(FILE_PATH)) return [];
    return JSON.parse(fs.readFileSync(FILE_PATH, "utf-8"));
  } catch (err) {
    console.error("Error reading subscribers.json:", err);
    return [];
  }
}

function writeData(data) {
  try {
    fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Error writing to subscribers.json:", err);
  }
}

app.post("/api/subscribe", async (req, res) => {
  const { firstName, lastName, email, interests } = req.body;
  const token = uuidv4();
  const timestamp = new Date().toISOString();

  const newSubscriber = {
    firstName,
    lastName,
    email,
    interests,
    confirmed: false,
    token,
    timestamp,
  };

  const data = readData();
  data.push(newSubscriber);
  writeData(data);

  try {
    await axios.post("https://api.brevo.com/v3/smtp/email", {
      sender: { name: "America's Cup Fans", email: "noreply@americascupfan.com" },
      to: [{ email, name: `${firstName} ${lastName}` }],
      subject: "Please confirm your subscription",
      htmlContent: `
        <h3>Welcome aboard, ${firstName}!</h3>
        <p>Click the link below to confirm your subscription:</p>
        <a href='${BASE_URL}/confirm/${token}'>Confirm Subscription</a>
      `,
    }, {
      headers: {
        "api-key": process.env.BREVO_API_KEY,
        "Content-Type": "application/json"
      }
    });

    res.status(200).json({ message: "Confirmation email sent." });
  } catch (error) {
    console.error("Brevo error:", error.message);
    res.status(500).json({ error: "Failed to send confirmation email." });
  }
});

app.get("/confirm/:token", (req, res) => {
  const { token } = req.params;
  const data = readData();
  const user = data.find(u => u.token === token);

  if (!user) {
    return res.status(404).send("Invalid token.");
  }

  user.confirmed = true;
  writeData(data);

  res.send(`<h2>Thank you ${user.firstName}, your subscription is confirmed!</h2>`);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
