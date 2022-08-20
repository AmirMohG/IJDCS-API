const express = require("express");
const router = express.Router();
const user = require("../models/User");
// Controllers
const {
  login,
  register,
  forgotPassword,
  resetPassword,
  verify
} = require("../controllers/auth");

router.route("/register").post(register);

router.route("/login").post(login);

router.route("/forgotpassword").post(forgotPassword);

router.route("/passwordreset/:resetToken").put(resetPassword);

router.route("/verify/:verificationToken").put(verify);

module.exports = router;
