// server.js
import app from "./api/index.js";

// PRIMA: const PORT = process.env.PORT || 8080;
// ORA:     const PORT = process.env.PORT;

const PORT = process.env.PORT;
if (!PORT) {
  console.error("❌ Errore: non ho trovato la variabile di ambiente PORT.");
  process.exit(1);
}

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🔍 Health check at: http://localhost:${PORT}/health`);
});
