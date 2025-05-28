const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const filePath = path.join(__dirname, "subscribers.json");

// Crea il file se non esiste
if (!fs.existsSync(filePath)) {
  fs.writeFileSync(filePath, "[]", "utf8");
}

// Endpoint POST per salvataggio iscrizioni
app.post("/api/subscribe", (req, res) => {
  const subscriber = {
    ...req.body,
    timestamp: new Date().toISOString(),
  };

  const currentData = JSON.parse(fs.readFileSync(filePath, "utf8"));
  currentData.push(subscriber);
  fs.writeFileSync(filePath, JSON.stringify(currentData, null, 2), "utf8");

  console.log("✅ Nuovo iscritto salvato:", subscriber);
  res.status(200).json({ message: "Subscription saved successfully." });
});


// Avvio server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
