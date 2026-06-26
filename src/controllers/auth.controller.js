const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const emailService = require("../services/email.service");

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

    const token = jwt.sign({ userID: userCreate._id }, process.env.JWT_SECRET, {
      expiresIn: "3d",
    });

    res.cookie("token", token);

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
    await emailService.sendEmailOnRegistration(
      userCreate.email,
      userCreate.name,
    );
  } catch (error) {
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
        message: "Invalid Email or Passwword",
      });
    }

    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        status: "failed",
        message: "Invalid Email or Passwword",
      });
    }

    const token = jwt.sign({ userID: user._id }, process.env.JWT_SECRET, {
      expiresIn: "3d",
    });

    res.cookie("token", token);

    res.status(200).json({
      message: "User Logged In Successfully",
      status: "success",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });

    await emailService.sendEmailOnLogin(user.email, user.name);
  } catch (error) {
    res.status(500).json({
      status: "failed",
      message: "Internal Server Error",
    });
  }
}

module.exports = {
  userRegisterController,
  userLoginController,
};
