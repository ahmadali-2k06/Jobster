const { registerUser, loginUser, logOut } = require("../../controllers/auth");
const express = require("express");
const Router = express.Router();

Router.route("/auth/register").post(registerUser);
Router.post("/auth/login", loginUser);
Router.post("/auth/logout", logOut);

module.exports = Router;
