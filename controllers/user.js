const { StatusCodes } = require("http-status-codes");
const User = require("../models/user");
const getUser = async (req, res) => {
  const id = req.params.id;
  const user = await User.findById(id);
  res.status(StatusCodes.OK).json({
    email: user.email,
    id: user.id,
    name: user.name,
    location: user.location,
  });
};

const updateUser = async (req, res) => {
  const { name, email, location } = req.body;
  const user = await User.findByIdAndUpdate(req.user.userId, {
    name: name,
    email: email,
    location: location,
  });
  res
    .status(StatusCodes.OK)
    .json({ name: user.name, email: user.email, location: user.location });
};

module.exports = { getUser, updateUser };
