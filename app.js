//imports
const express = require("express");
const app = express();
const ejs = require("ejs");
const connectDB = require("./db/connect");
const errorHandler = require("./middlewares/errorHandler");
//api routes
const authRoute = require("./routes/api/auth");
const jobsRoute = require("./routes/api/jobs");
const refreshTokenRoute = require("./routes/api/refreshToken");
const userRoute = require("./routes/api/user");
//views routes
const landingPageRoute = require("./routes/views/landingPage");
const loginRoute = require("./routes/views/login");
const dashboardRoute = require("./routes/views/dashboard");
const authenticator = require("./middlewares/authentication");
const {
  AuthenticationError,
  BadRequestError,
} = require("./errors/AuthenticationError");
require("dotenv").config();
//security packages import
const helmet = require("helmet");
const { xss } = require("express-xss-sanitizer");
const cors = require("cors");
const ratelimiter = require("express-rate-limit");
const cookieParser = require("cookie-parser");

//documentation libraries imports
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");

//doucumentation setup
const swaggerDocument = YAML.load("./swagger.yaml");
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
//security middlewares
app.use(cookieParser());
app.set("trust proxy", 1);
app.use(
  ratelimiter({
    windowsMs: 15 * 60 * 1000,
    max: 100,
  })
);
app.use(helmet());
app.use(cors());
app.use(xss());
// app.use(xss());
//middlewares
app.use(express.json());
app.use(express.static("./public"));
app.set("view engine", "ejs");
//static routes
app.use("/", landingPageRoute);
app.use("/login", loginRoute);
app.use("/dashboard", dashboardRoute);
//api routes
app.use("/jobs", jobsRoute);
app.use("/", authRoute);
app.use("/auth", refreshTokenRoute);
app.use("/user", userRoute);
//error Handler Middleware
app.use(errorHandler);

//app start
const PORT = process.env.PORT || 5000;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(PORT, () => {
      console.log("App is listening on PORT " + PORT);
    });
  } catch (err) {
    console.log(err);
  }
};

start();
