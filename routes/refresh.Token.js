const { refreshAccesToken } = require("./auth");
const express = require("express");
const router = express.Router();
router.route("/refreshToken").post(refreshAccesToken);
