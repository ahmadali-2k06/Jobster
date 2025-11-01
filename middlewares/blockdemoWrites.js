const { StatusCodes } = require("http-status-codes");
const blockDemoWrites = (req, res, next) => {
  if (
    req.user?.readonly &&
    ["POST", "PUT", "PATCH", "DELETE"].includes(req.method)
  ) {
    return res
      .status(StatusCodes.FORBIDDEN)
      .json({ msg: "Demo mode: Read only" });
  }
  next();
};
module.exports = blockDemoWrites;
