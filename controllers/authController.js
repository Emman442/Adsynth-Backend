const userModel = require("../models/userModel");

const jwt = require("jsonwebtoken");
const { promisify } = require("util");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.EXPIRES_IN,
  });
};
const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id);
  res.cookie("jwt", token, {
    expires: new Date(
      Date.now() +
        Number(process.env.JWT_COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: req.secure || req.headers["x-forwarded-proto"] === "https",
  });
  user.password = undefined;
  res.status(statusCode).json({
    user,
    token,
  });
};

exports.signUp = async (req, res, next) => {
  // Extract data from request body
  const { fullName, email, password } = req.body;

  try {
    // Check for existing user
    const userAlreadyExists = await userModel.findOne({ email });
    if (userAlreadyExists) {
      return res.status(409).json({
        message: "Email is already taken",
      });
    }

    // Create new user
    const newUser = await userModel.create({
      fullName,
      email,
      password,
    });

    // Send successful response
    res.status(200).json({
      status: "success",
      data: {
        newUser,
      },
    });
  } catch (err) {
    // Handle errors
    return res.status(400).json({ message: "An error occurred!", error: err });
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Please provide email and password!", error: err });
  }

  const user = await userModel.findOne({ email }).select("+password");

  if (!user || !(await user.comparePassword(password, user.password))) {
    return res.status(400).json({ message: "Incorrect email or password" });
  }

  createSendToken(user, 200, req, res);
};

exports.protect = async (req, res, next) => {
  const testToken = req.headers.authorization;
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return res
      .status(401)
      .json({ message: "You are not logged in!, please login to get access" });
  }

  const decodedToken = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET
  );
  const currentUser = await userModel.findById(decodedToken.id);
  if (!currentUser) {
    return res
      .status(401)
      .json({ message: "The User belonging to this token does not exist!" });
  }
  const passwordChangedAfter = async function (user, JWTTimestamp) {
    if (user.passwordChangedAt) {
      const changedTimeStamp = parseInt(
        user.passwordChangedAt.getTime() / 1000,
        10
      );
      return JWTTimestamp < changedTimeStamp;
    }
    return false;
  };
  if (!passwordChangedAfter) {
    return res
      .status(401)
      .json({ message: "recently changed password, please log in again!" });
  }

  req.user = currentUser;
  res.locals.user = currentUser;
  next();
};

exports.forgotPassword = async (req, res, next) => {
  const user = await userModel.findOne({ email: req.body.email });
  if (!user) {

        return res
          .status(404)
          .json({ message: "There is no user with email address." });
  }

  const resetToken = user.createResetToken();
  await user.save({ validateBeforeSave: false });

  try {
    baseURL = "https://creedlance.net";
    const resetURL = `${baseURL}/resetPassword/${resetToken}`;
    await new Email(user, resetURL).sendPasswordReset();
    console.log(resetURL);

    res.status(200).json({
      status: "success",
      message: "Token sent to email!",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    console.log(err);
    return next(
      new AppError("There was an error sending the email. Try again later!"),
      500
    );
  }
};
