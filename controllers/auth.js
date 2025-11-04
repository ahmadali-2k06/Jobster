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
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .json({
      user: { userID: user._id, name: user.name },
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
    throw new AuthenticationError("Invalid Credentials! Please try again.");
  }
  const passwordCheckPassed = await user.checkPassword(password);
  if (!passwordCheckPassed) {
    throw new AuthenticationError("Invalid Credentials! Please try again.");
  }
  const isDemo = user.email === "demo@test.com";

  const refreshToken = user.createRefreshJWT();
  const accessToken = user.createAccessJWT({
    readonly: isDemo,
  });
  if (!isDemo) {
    await User.updateOne(
      { _id: user._id },
      { $push: { refreshTokens: refreshToken } }
    );
  }
  res
    .status(StatusCodes.OK)
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .json({
      user: {
        userID: user._id,
        name: user.name,
        readonly: isDemo,
      },
      accessToken,
    });
};

//refresh access token

const refreshAccessToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    throw new BadRequestError("No refresh token provided");
  }
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET_REFRESH);
    const user = await User.findById(decoded.userId);
    if (!user) {
      throw new AuthenticationError("Invalid token provided");
    }
    const isDemo = user.email === "demo@test.com";
    if (!isDemo && !user.refreshTokens.includes(refreshToken)) {
      throw new AuthenticationError("Invalid token provided");
    }
    const accessToken = user.createAccessJWT({ readonly: isDemo });
    return res.status(StatusCodes.OK).json({ accessToken });
  } catch (err) {
    const user = await User.findOne({ refreshTokens: refreshToken });
    if (user && user.email !== "demo@test.com") {
      user.refreshTokens = user.refreshTokens.filter((t) => t !== refreshToken);
      await user.save();
    }
    throw new AuthenticationError("Refresh token expired or invalid");
  }
};

const demoLogin = async (req, res) => {
  const demoUser = await User.findOne({ email: "demo@test.com" });
  if (!demoUser) {
    throw new AuthenticationError("Demo user account not found.");
  }

  const refreshToken = demoUser.createRefreshJWT();
  const accessToken = demoUser.createAccessJWT({ readonly: true });

  res
    .status(StatusCodes.OK)
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .json({
      user: {
        userID: demoUser._id,
        name: demoUser.name,
        readonly: true,
      },
      accessToken,
    });
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
module.exports = {
  registerUser,
  loginUser,
  refreshAccessToken,
  logOut,
  demoLogin,
};
