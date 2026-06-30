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
const transactionRoutes = require("./routes/transaction.routes");

app.get("/", (req, res) => {
  res.send("Service is up and running on web server");
}); // for testing on web server

/**
 * - Use Routes
 */

app.use("/api/auth", authRoutes);
app.use("/api/accounts", accountRoutes);
app.use("/api/transaction", transactionRoutes);

module.exports = app;
