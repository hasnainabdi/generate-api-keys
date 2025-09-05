const express = require("express");
const app = express();
const path = require("path");

// Port define karo
const PORT = 3000;

// Public folder (jahan frontend files rakhe hain) serve karna
app.use(express.static(path.join(__dirname, "../"))); 

// Home page serve karna
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../index.html"));
});

// Server start karna
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});


require("dotenv").config();
const port = 3000;

// API Key env se lo
const apiKey = process.env.API_KEY;

// Example route
app.get("/api/data", (req, res) => {
  res.json({ message: "API working", key: apiKey });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
