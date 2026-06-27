const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const emailService = require("../services/email.service");
const blacklistToken = require("../models/blacklistToken.model");

/**
 * - JWT token generation function
 */

function generateToken(userId) {
  return jwt.sign({ userID: userId }, process.env.JWT_SECRET, {
    expiresIn: "3d",
  });
}

function setAuthCookie(res, token) {
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    maxAge: 3 * 24 * 60 * 60 * 1000,
  });
}
/**
 * - User register controller
 * - Post api - api/auth/register
 */

async function userRegisterController(req, res) {
  const { name, email, password } = req.body;
  try {
    if (!name || !email || !password) {
      return res.status(400).json({
        status: "failed",
        message: "All fields are required",
      });
    }

    const isUserExist = await userModel.findOne({
      email: email,
    });

    if (isUserExist) {
      return res.status(422).json({
        message: " User already exists with this email",
        status: "failed",
      });
    }

    const userCreate = await userModel.create({
      name,
      email,
      password,
    });

    const token = generateToken(userCreate._id);

    setAuthCookie(res, token);

    res.status(201).json({
      message: "User Created Successfully",
      status: "success",
      user: {
        _id: userCreate._id,
        name: userCreate.name,
        email: userCreate.email,
      },
    });

    /**
     * - Send email on registration
     */

    try {
      await emailService.sendEmailOnRegistration(
        userCreate.email,
        userCreate.name,
      );
    } catch (error) {
      console.error("Error in email service", error.message);
    }
  } catch (error) {
    console.error(error);
    if (error.name === "ValidationError") {
      return res.status(400).json({
        status: "failed",
        message: Object.values(error.errors)
          .map((err) => err.message)
          .join(", "),
      });
    }

    res.status(500).json({
      status: "failed",
      message: "Internal Server Error",
    });
  }
}

/**
 * - User Login controller
 * - Post api -api/auth/login
 */

async function userLoginController(req, res) {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({
        status: "failed",
        message: "All fields are required",
      });
    }

    const user = await userModel.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        status: "failed",
        message: "Invalid Email or password",
      });
    }

    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        status: "failed",
        message: "Invalid Email or password",
      });
    }

    const token = generateToken(user._id);

    setAuthCookie(res, token);

    res.status(200).json({
      message: "User Logged In Successfully",
      status: "success",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });

    try {
      await emailService.sendEmailOnLogin(user.email, user.name);
    } catch (error) {
      console.error("Error in email service", error.message);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "failed",
      message: "Internal Server Error",
    });
  }
}

/**
 * - Logout Api with Token Blacklist
 * - Logout Api - api/auth/logout
 */

async function userLogoutController(req, res) {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(400).json({
      message: "No active session found",
    });
  }

  try {
    await blacklistToken.create({
      token: token,
    });

    res.clearCookie("token");

    res.status(200).json({
      message: "User logged out successfully",
    });

    try {
      await emailService.sendEmailOnLogout(req.user.email, req.user.name);
    } catch (error) {
      console.error("Error in email service", error.message);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "failed",
      message: "Internal Server Error",
    });
  }
}

module.exports = {
  userRegisterController,
  userLoginController,
  userLogoutController,
};
