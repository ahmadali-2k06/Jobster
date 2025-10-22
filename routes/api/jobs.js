const express = require("express");
const authenticator = require("../../middlewares/authentication");
const {
  createJob,
  deleteJob,
  getAlljobs,
  getJob,
  updateJob,
  jobsCount,
} = require("../../controllers/jobs");
const Router = express.Router();
Router.use(authenticator);

Router.route("/").get(getAlljobs).post(createJob);
Router.route("/:id")
  .get(getJob)
  .patch(updateJob)
  .delete(deleteJob)
  .post(jobsCount);

module.exports = Router;
