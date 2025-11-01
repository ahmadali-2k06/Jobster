const express = require("express");
const { getUser, updateUser} = require("../../controllers/user");
const authenticator = require("../../middlewares/authentication");
const router = express.Router();
router.use(authenticator);
router.get("/:id", getUser);
router.patch("/:id", updateUser);
module.exports = router;
