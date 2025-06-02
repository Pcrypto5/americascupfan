import app from "./api/index.js";

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
