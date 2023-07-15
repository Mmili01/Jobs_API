const Job = require("../models/Job");
const user = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

const getAllJobs = async (req, res) => {
  const usersId = user._id
  const jobs = await Job.find({ createdBy: req.user.usersId }).sort("createdAt");
  res.status(StatusCodes.OK).json({ jobs, count: jobs.length });
  console.log(usersId)
  res.send("get all jobs ");
};
const getJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = req;
  

  const job = await Job.findOne({
    _id: jobId,
    createdBy: userId,
  });
  if (!job) {
    throw new NotFoundError("No job with such ID");
  }
  res.status(StatusCodes.OK).json({ job });
};
const createJobs = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const job = await Job.create(req.body);
  res.status(StatusCodes.CREATED).json({ job });
};
const updateJobs = async (req, res) => {
  const {
    body:{company,position},
    user: { userId },
    params: { id: jobId },
  } = req;
  if (company === "" || position === ""){
    throw new BadRequestError("Feilds cannot be empty")
  }
  const job = await Job.findOneAndUpdate({_id:jobId, createdBy:userId}, req.body,{new:true,runValidators:true})
  if (!job) {
    throw new NotFoundError("No job with such ID");
  }
  res.status(StatusCodes.OK).json({ job });
};
const deleteJobs = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = req;

  
  const job = await Job.findOneAndRemove({
    _id:jobId,
    createdBy:userId
  })
  if (!job) {
    throw new NotFoundError("No job with such ID");
  }
  res.status(StatusCodes.OK).json({ job });
};

module.exports = {
  getAllJobs,
  getJob,
  createJobs,
  updateJobs,
  deleteJobs,
};
