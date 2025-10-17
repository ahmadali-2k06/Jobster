const Job = require("../models/job");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors/errors");
const createJob = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const job = await Job.create(req.body);
  res.status(StatusCodes.CREATED).json({ job });
};
const getAlljobs = async (req, res) => {
  const createdBy = req.user.userId;
  const jobs = await Job.find({ createdBy }).sort("createdAt");
  res.status(StatusCodes.OK).json({ jobs, jobsCount: jobs.length });
};
const deleteJob = async (req, res) => {
  const { id } = req.params;

  const job = await Job.findOneAndDelete({
    _id: id,
    createdBy: req.user.userId,
  });
  if (!job) {
    throw new NotFoundError("Job not found with this id!");
  }
  return res.status(StatusCodes.OK).json({ msg: "deleted" });
};
const getJob = async (req, res) => {
  const id = req.params.id;
  const user = req.user.userId;
  const job = await Job.findOne({
    _id: id,
    createdBy: req.user.userId,
  });
  if (!job) {
    throw new NotFoundError("Job not found with this id!");
  }
  return res.status(StatusCodes.OK).json({ job: job, createdBy: user });
};
const updateJob = async (req, res) => {
  const id = req.params.id;
  const { company, position } = req.body;
  if (!company || !position) {
    throw new BadRequestError("Company and position must be provided");
  }
  const job = await Job.findOneAndUpdate(
    { _id: id, createdBy: req.user.userId },
    {
      company: company,
      position: position,
    },
    { new: true, runValidators: true }
  );
  if (!job) {
    throw new NotFoundError("Job not found with this id!");
  }
  return res.status(StatusCodes.OK).json({ job: job });
};

module.exports = {
  createJob,
  deleteJob,
  getAlljobs,
  getJob,
  updateJob,
};
