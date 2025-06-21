// api/index.js
import express from "express";
import path from "path";
// importa qui le tue API, ad es.:
// import apiRoutes from "./routes.js";

const app = express();

// 1) Servi in modo statico tutto ciò che sta in /public
app.use(
  express.static(
    path.join(process.cwd(), "public")
  )
);

// 2) (opzionale) health-check o altre route API
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// 3) Monta qui le tue API REST se le hai:
// app.use("/api", apiRoutes);

// 4) Catch-all: per ogni altra richiesta, servi index.html (React Router)
app.get("*", (req, res) => {
  res.sendFile(path.join(process.cwd(), "public", "index.html"));
});

export default app;
