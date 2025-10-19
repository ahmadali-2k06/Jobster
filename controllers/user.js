const { StatusCodes } = require("http-status-codes");
const User = require("../models/user");
const getUser = async (req, res) => {
  const id = req.params.id;
  const user = await User.findById(id);
  res
    .status(StatusCodes.OK)
    .json({ email: user.email, id: user.id, name: user.name });
};
module.exports = getUser;
