const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const { BadRequestError, AuthenticationError } = require("../errors/errors");
const User = require("../models/user");
//register user
const registerUser = async (req, res) => {
  const user = await User.create({ ...req.body });
  const refreshToken = user.createRefreshJWT();
  const accessToken = user.createAccessJWT();
  user.refreshTokens.push(refreshToken);
  await user.save();
  req.user = { name: user.name, UserID: user._id };
  res
    .status(StatusCodes.CREATED)
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .json({
      User: { name: user.name, UserID: user._id },
      accessToken,
    });
};

//login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("Please provide all the credentials");
  }
  const user = await User.findOne({ email: email });
  if (!user) {
    throw new AuthenticationError("Invalid Credentials! Please try again. ");
  }
  const passwordCheckPassed = await user.checkPassword(password);
  if (passwordCheckPassed) {
    const refreshToken = user.createRefreshJWT();
    const accessToken = user.createAccessJWT();
    user.refreshTokens.push(refreshToken);
    await User.updateOne(
      { _id: user._id },
      { $push: { refreshTokens: refreshToken } }
    );
    req.user = { name: user.name, UserID: user._id };
    res
      .status(StatusCodes.OK)
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({ user: { userID: user._id, name: user.name }, accessToken });
  } else {
    throw new AuthenticationError("Invalid Credentials! Please try again. ");
  }
};

//refresh access token
const refreshAccessToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    throw new BadRequestError("No refresh token provided");
  }

  const user = await User.findOne({ refreshTokens: refreshToken });
  if (!user) {
    throw new AuthenticationError("Invalid token provided");
  }
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET_REFRESH);

    const user = await User.findById(decoded.userId);
    if (!user || !user.refreshTokens.includes(refreshToken)) {
      throw new AuthenticationError("Invalid token provided");
    }

    const accessToken = user.createAccessJWT();
    return res.status(StatusCodes.OK).json({ accessToken });
  } catch (err) {
    const user = await User.findOne({ refreshTokens: refreshToken });
    if (user) {
      user.refreshTokens = user.refreshTokens.filter((t) => t !== refreshToken);
      await user.save();
    }
    throw new AuthenticationError("Refresh token expired or invalid");
  }
};
module.exports = { registerUser, loginUser, refreshAccessToken };
