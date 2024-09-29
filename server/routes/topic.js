const express = require("express");
const router = express.Router();
const {postNewTopic, getAllTopic} = require("../controllers/topic")

router.route("/new").post(postNewTopic);
router.route("/all").get(getAllTopic)

module.exports = router;
