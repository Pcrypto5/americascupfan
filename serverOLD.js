// server.js
import express from "express";
import path from "path";

const app = express();

// 1) Servi staticamente tutto ciò che sta in /public
app.use(
  express.static(
    path.join(process.cwd(), "public")
  )
);

// 2) Health‐check (opzionale)
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// 3) Catch‐all per React Router: tutte le altre richieste ritornano index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(process.cwd(), "public", "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
