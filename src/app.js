const express = require("express");

const cookiesParser = require("cookie-parser");

const app = express();

const authRoutes = require("./routes/auth.routes");

app.use(cookiesParser());
app.use(express.json());
app.use("/api/auth", authRoutes);

module.exports = app;
