const userModel = require("../models/user.model");

const jwt = require("jsonwebtoken");

async function authUser(req, res, next) {
    
    // Get the token from cookies
  const { token } = req.cookies;

  if (!token)
    return res.status(401).json({
      message: "unauthrized",
    });

  try {
    //verify the token
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    // find user by id
    const user = await userModel.findById(decode.id);

    req.user = user;

    next();
  } catch (error) {
    res.status(401).json({
      message: "unauthrized",
    });
  }
}

module.exports = {
    authUser
}