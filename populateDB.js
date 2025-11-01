const mongoose = require("mongoose");
const connectDB = require("./db/connect");
const Job = require("./models/job");
const jobsJson = require("./jobs.json");
require("dotenv").config();
const userId = "690616d36d94a466a8a881a2";
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    console.log("Connection Successfull!");

    await Job.deleteMany({ createdBy: userId });
    console.log("Products Deleted Sucessfully");
    const jobsWithUser = jobsJson.map((job) => ({
      ...job,
      createdBy: userId,
    }));
    await Job.insertMany(jobsWithUser);
    console.log("Database populated successfully");
    process.exit(0);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};
start();
