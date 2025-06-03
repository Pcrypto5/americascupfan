// server.js
import app from "./api/index.js";

const PORT = process.env.PORT;
if (!PORT) {
  console.error("❌ ERRORE: process.env.PORT non è definito!");
  process.exit(1);
}

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🔍 Health check at: http://localhost:${PORT}/health`);
});
