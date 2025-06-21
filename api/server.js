// server.js
import express from "express";
import path from "path";

const app = express();

// 1) Servi staticamente ogni file in /public
app.use(
  express.static(
    path.join(process.cwd(), "public")
  )
);

// 2) Health-check (opzionale)
app.get("/health", (req, res) => {
  return res.json({ status: "ok" });
});

// 3) (Qui potresti montare altre API, se le hai)
// import apiRoutes from "./api/routes.js";
// app.use("/api", apiRoutes);

// 4) Tutte le altre route vanno a React Router: serve index.html
app.get("*", (req, res) => {
  return res.sendFile(path.join(process.cwd(), "public", "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
