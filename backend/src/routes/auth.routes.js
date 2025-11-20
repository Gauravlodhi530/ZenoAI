const express = require('express');
const authController = require('../controllers/auth.controller');
const { authUser } = require('../middlewares/auth.middleware');
const router = express.Router();


// Register, login, user info, logout
router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);
router.get("/me", authUser, authController.getCurrentUser);
router.post("/logout", authUser, authController.logoutUser);

// Password reset routes
router.post("/reset-password-request", authController.resetPasswordRequest); // user enters email
router.post("/reset-password", authController.resetPassword); // user submits new password

module.exports = router;