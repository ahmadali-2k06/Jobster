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

const jobsCount = async (req, res) => {
  const userId = req.params.id;
  const jobs = await Job.find({ createdBy: userId });
  const interviewScheduled = await Job.find({
    status: "interview",
    createdBy: userId,
  });
  const pending = await Job.find({ status: "pending", createdBy: userId });
  const declined = await Job.find({ status: "declined", createdBy: userId });
  const monthCounts = {};
  jobs.forEach((job) => {
    const date = new Date(job.createdAt);
    const monthName = date.toLocaleString("default", { month: "long" });
    monthCounts[monthName] = (monthCounts[monthName] || 0) + 1;
  });
  res.status(200).json({
    monthCounts,
    statusdistributed: {
      interviewScheduled: interviewScheduled.length,
      pending: pending.length,
      declined: declined.length,
    },
  });
};

module.exports = {
  createJob,
  deleteJob,
  getAlljobs,
  getJob,
  updateJob,
  jobsCount
};
