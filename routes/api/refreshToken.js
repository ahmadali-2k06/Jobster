const { refreshAccessToken } = require("../../controllers/auth");
const express = require("express");
const router = express.Router();
router.route("/refreshToken").post(refreshAccessToken);
module.exports = router;
