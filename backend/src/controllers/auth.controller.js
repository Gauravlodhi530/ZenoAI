const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

async function registerUser(req, res) {
  const {
    fullName: { firstName, lastName },
    email,
    password,
  } = req.body;

  const isuserAlreadyExists = await userModel.findOne({ email });

  if (isuserAlreadyExists) {
    res.status(400).json({
      message: "user already exists",
    });
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await userModel.create({
    fullName: {
      firstName,
      lastName,
    },
    email,
    password: hashedPassword,
  });
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

  res.cookie("token", token);
  res.status(201).json({
    message: "user registered successfully",
    user: {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
    },
  });
}

async function loginUser(req, res) {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });
  if (!user)
    return res.status(400).json({
      message: "invalid username and password",
    });

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid)
    return res.status(400).json({
      message: "invalid password",
    });

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);

  res.cookie("token", token);

  res.status(200).json({
    message: "user login successfully",
    user: {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
    },
    token,
  });
}

async function getCurrentUser(req, res) {
  try {
    res.status(200).json({
      message: "user retrieved successfully",
      user: {
        id: req.user._id,
        fullName: req.user.fullName,
        email: req.user.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "server error",
    });
  }
}

async function logoutUser(req, res) {
  try {
    res.clearCookie("token");
    res.status(200).json({
      message: "user logged out successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "server error",
    });
  }
}





// User submits email for password reset
async function resetPasswordRequest(req, res) {
  const { email } = req.body;
  const user = await userModel.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "user not found" });
  }
  // Optionally, generate a token and send email here. For now, just success response.
  // You can set a resetToken if you want to add email verification later.
  return res.status(200).json({ message: "user found, proceed to reset password", userId: user._id });
}

// User submits new password and confirm password
async function resetPassword(req, res) {
  const { email, newPassword, confirmPassword } = req.body;
  if (!email || !newPassword || !confirmPassword) {
    return res.status(400).json({ message: "all fields are required" });
  }
  if (newPassword !== confirmPassword) {
    return res.status(400).json({ message: "passwords do not match" });
  }
  const user = await userModel.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "user not found" });
  }
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  await user.save();
  return res.status(200).json({ message: "password reset successful" });
}

module.exports = {
  registerUser,
  loginUser,
  getCurrentUser,
  logoutUser,
  resetPasswordRequest,
  resetPassword,
};
