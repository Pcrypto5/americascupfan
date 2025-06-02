import app from "./api/index.js";

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🔍 Health check at: http://localhost:${PORT}/health`);
});
