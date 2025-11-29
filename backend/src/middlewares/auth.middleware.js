const userModel = require("../models/user.model");

const jwt = require("jsonwebtoken");

async function authUser(req, res, next) {
  let token = req.cookies?.token;

  if (!token) {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }
  }

  if (!token) {
    return res.status(401).json({
      message: "unauthrized",
    });
  }

  try {
    // verify the token
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    // find user by id
    const user = await userModel.findById(decode.id);

    if (!user) {
      return res.status(401).json({
        message: "unauthrized",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    res.status(401).json({
      message: "unauthrized",
    });
  }
}

module.exports = {
  authUser,
};