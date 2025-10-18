const { refreshAccessToken } = require("./auth");
const express = require("express");
const router = express.Router();
router.route("/refreshToken").post(refreshAccessToken);
