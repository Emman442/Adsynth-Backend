const userModel = require("../models/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const jwt = require("jsonwebtoken");
const {promisify} = require("util")

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

exports.signUp = catchAsync(async (req, res, next) => {
  const {fullName, email, password } = req.body;
  const userAlreadyExists = await userModel.findOne({ email });
  if (userAlreadyExists) {
    return next(new AppError("User Already Exists, please login", 400));
  }

  const newUser = await userModel.create({
    fullName,
    email,
    password,
  });

  res.status(200).json({
    status: "success",
    data: {
      newUser,
    },
  });
});


exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please provide email and password!", 400));
  }

  const user = await userModel.findOne({ email }).select("+password");

  if (!user || !(await user.comparePassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  createSendToken(user, 200, req, res);
});



exports.protect = catchAsync(async (req, res, next) => {
  const testToken = req.headers.authorization;
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(
      new AppError("You are not logged in!, please login to get access", 401)
    );
  }

  const decodedToken = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET
  );
  const currentUser = await userModel.findById(decodedToken.id);
  if (!currentUser) {
    return next(
      new AppError("The User belonging to this token does not exist!", 401)
    );
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
    return next(
      new AppError("recently changed password, please log in again", 401)
    );
  }

  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await userModel.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError("There is no user with email address.", 404));
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
});