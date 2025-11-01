const {
  registerUser,
  loginUser,
  logOut,
  demoLogin,
} = require("../../controllers/auth");
const express = require("express");
const Router = express.Router();

Router.route("/auth/register").post(registerUser);
Router.post("/auth/login", loginUser);
Router.post("/auth/logout", logOut);
Router.post("/auth/demo-login", demoLogin);

module.exports = Router;
