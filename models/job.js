const mongoose = require("mongoose");
const jobsSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, "PLease provide Company Name"],
      maxLength: 50,
    },
    position: {
      type: String,
      required: [true, "PLease provide Position"],
    },
    status: {
      type: String,
      enum: ["pending", "interview", "declined", "hired"],
      default: "pending",
    },
    createdBy: {
      type: mongoose.Types.ObjectId,  
      ref: "User",
      required: [true, "Please provide user"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", jobsSchema);
