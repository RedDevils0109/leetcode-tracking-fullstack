const express = require("express");
const router = express.Router();
const { isAuthenticatedUser } = require("../middlewares/auth");
const { getUserProfile, updateUser } = require("../controllers/user");

router
  .route("/profile")
  .get(isAuthenticatedUser, getUserProfile)
  .put(isAuthenticatedUser, updateUser);

module.exports = router;
