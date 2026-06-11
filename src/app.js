const express = require("express");

const cookiesParser = require("cookie-parser");

const app = express();

app.use(cookiesParser());
app.use(express.json());

/**
 * - Import Routes
 */
const authRoutes = require("./routes/auth.routes");
const accountRoutes = require("./routes/account.routes");

/**
 * - Use Routes
 */
app.use("/api/auth", authRoutes);
app.use("/api/accounts", accountRoutes);

module.exports = app;
