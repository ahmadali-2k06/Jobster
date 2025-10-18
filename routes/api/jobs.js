const express = require("express");
const authenticator = require("../../middlewares/authentication");
const {
  createJob,
  deleteJob,
  getAlljobs,
  getJob,
  updateJob,
} = require("../../controllers/jobs");
const Router = express.Router();
Router.use(authenticator);

Router.route("/").get(getAlljobs).post(createJob);
Router.route("/:id").get(getJob).patch(updateJob).delete(deleteJob);

module.exports = Router;
