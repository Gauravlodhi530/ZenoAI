const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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
    user,
    token,
  });
}

module.exports = { registerUser, loginUser };
