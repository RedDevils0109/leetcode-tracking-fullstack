const express = require("express");
const router = express.Router();
const { isAuthenticatedUser } = require("../middlewares/auth");

const { registerUser, logout, loginUser, resetToken } = require("../controllers/auth");

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logout);
router.route("/refresh-token").post(resetToken)

module.exports = router;
