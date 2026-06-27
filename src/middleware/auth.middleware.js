const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const blacklistToken = require("../models/blacklistToken.model");

function extractToken(req) {
  const authHeader = req.headers.authorization;

  if (req.cookies.token) {
    return req.cookies.token;
  }

  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.split(" ")[1];
  }

  return null;
}
/**
 * - Authentication middleware
 */

async function authMiddleware(req, res, next) {
  const token = extractToken(req);
  if (!token) {
    return res.status(401).json({
      message: "Unauthorized access, token is missing",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const isBlacklisted = await blacklistToken.findOne({ token });

    if (isBlacklisted) {
      return res.status(401).json({
        message: "Unauthorized access, token is invalid",
      });
    }

    const user = await userModel.findById(decoded.userID);

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }
    req.user = user;

    return next();
  } catch (error) {
    console.error("Token error", error);
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Unauthorized access, Token expired",
      });
    }

    return res.status(401).json({
      message: "Unauthorized access, Invalid token",
    });
  }
}

async function authSystemUserMiddleware(req, res, next) {
  const token = extractToken(req);

  if (!token) {
    return res.status(401).json({
      message: "Unauthorized access, token is missing",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const isBlacklisted = await blacklistToken.findOne({ token });

    if (isBlacklisted) {
      return res.status(401).json({
        message: "Unauthorized access, token is invalid",
      });
    }

    const user = await userModel.findById(decoded.userID).select("+systemUser");
    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }
    if (!user.systemUser) {
      return res.status(403).json({
        message: "Forbidden access, not a system user",
      });
    }

    req.user = user;

    return next();
  } catch (error) {
    console.error("Token error", error);
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Unauthorized access, Token expired",
      });
    }

    return res.status(401).json({
      message: "Unauthorized access, Invalid token",
    });
  }
}

module.exports = {
  authMiddleware,
  authSystemUserMiddleware,
};
