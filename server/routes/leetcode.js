const express = require("express");
const router = express.Router();
const { isAuthenticatedUser } = require("../middlewares/auth");
const {postLeetcode, getAllLeetCode, getSingleLeetcode, editSingleLeetcode} = require('../controllers/leetcode');



router.route("/new").post(isAuthenticatedUser,postLeetcode);
router.route("/all").get(isAuthenticatedUser, getAllLeetCode)

router.route("/single/:slug").get(isAuthenticatedUser,getSingleLeetcode)
.put(isAuthenticatedUser, editSingleLeetcode)



module.exports = router