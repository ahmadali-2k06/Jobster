const { registerUser, loginUser } = require("../controllers/auth");
const express = require("express");
const Router = express.Router();

Router.route("/auth/register").post(registerUser);
Router.post("/auth/login", loginUser);

module.exports = Router;
