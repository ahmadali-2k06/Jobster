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
  const id = req.params.id;
  const { name, email, location } = req.body;
  const user = await User.findByIdAndUpdate(id, {
    name: name,
    email: email,
    location: location,
  });
  res
    .status(StatusCodes.OK)
    .json({ name: user.name, email: user.email, location: user.location });
};

const logOut = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(StatusCodes.NO_CONTENT);

    const user = await User.findOne({ refreshTokens: refreshToken });
    if (!user) {
      res.clearCookie("refreshToken", { httpOnly: true, sameSite: "strict" });
      return res.sendStatus(204);
    }

    user.refreshTokens = user.refreshTokens.filter(
      (token) => token !== refreshToken
    );
    await user.save();

    res.clearCookie("refreshToken", { httpOnly: true, sameSite: "strict" });

    return res
      .status(StatusCodes.OK)
      .json({ message: "Logged out successfully" });
  } catch (err) {
    console.error(err);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Server error during logout" });
  }
};

module.exports = { getUser, updateUser,logOut };
