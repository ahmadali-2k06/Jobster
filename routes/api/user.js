const express = require("express");
const getUser = require("../../controllers/user");
const authenticator = require("../../middlewares/authentication");
const router = express.Router();
router.use(authenticator);
router.get("/:id", getUser);
module.exports = router;
