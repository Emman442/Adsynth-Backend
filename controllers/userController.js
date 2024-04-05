const userModel = require("../models/userModel");

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.saveUserWebsiteDetails = async (req, res, next) => {
  const website = req.body.website;
  const updatedUser = await userModel.findByIdAndUpdate(
    req.user._id,
    { website },
    { new: true }
  );
  res.status(200).json({
    status: "success",
    data: {
      updatedUser,
    },
  });
};

exports.getUserWebsite = async (req, res, next) => {
  const userId = req.user._id;
  const user = await userModel.findById(req.user._id);
  const userWebsite = user.website;
  res.status(200).json({
    status: "success",
    data: { userWebsite },
  });
};
exports.AddTagSetUp = async (req, res, next) => {
  const user = await userModel.findById(req.user._id);
  if (user.website === null) {
    return res
      .status(400)
      .json({ message: "Please provide a website to generate a tag" });
  }
  const userWebsite = user.website;
  const userWebTag = `<script src = '${user.website}'></script>`;
  const updatedUser = await userModel.findByIdAndUpdate(
    req.user._id,
    { userWebTag },
    { new: true }
  );
  res.status(200).json({
    status: "success",
    data: { updatedUser },
  });
};
exports.getTagSetUp = async (req, res, next) => {
  const user = await userModel.findById(req.user._id);
  const userWebsiteTag = user.userWebTag;
  res.status(200).json({
    status: "success",
    data: { userWebsiteTag },
  });
};

exports.saveUserGoogleDetails = async (req, res, next) => {
  const { googleId } = req.body;

  if (!googleId) {
    return res.status(400).json({
      message: "Please Input google Id",
    });
  }

  try {
    const user = await userModel.findByIdAndUpdate(
      req.user._id,
      { googleId },
      { new: true }
    );
    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (err) {
    return res.status(400).json({ message: "An error occurred!", error: err });
  }
};

exports.saveUserFacebookDetails = async (req, res, next) => {
  const { facebookId } = req.body;

  if (!facebookId) {
    return res.status(400).json({
      message: "Please Input facebook Id",
    });
  }

  try {
    const user = await userModel.findByIdAndUpdate(
      req.user._id,
      { facebookId },
      { new: true }
    );
    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: "An error occurred!", error: err });
  }
};

exports.UpdateUserProfile = async (req, res, next) => {
  try{
    // 2) Filtered out unwanted fields names that are not allowed to be updated
    const filteredBody = filterObj(
      req.body,
      "country",
      "city",
      "state",
      "phoneNumber",
      "address",
    
    );
    if (req.file) filteredBody.photo = req.file.filename;

    // 3) Update user document
    const updatedUser = await userModel.findByIdAndUpdate(
      req.user.id,
      filteredBody,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      status: "success",
      data: {
        user: updatedUser,
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: "An error occurred!", error: err });
  }
};
exports.fetchUser = async (req, res, next) => {
  try {
    let userId;
    userId = req.params.id ? req.params.id : req.user._id;
    const user = await userModel.findById(userId).populate("campaigns");
  

    res.status(200).json({
      status: "success",
      data: {
        user
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "error Occured",
      error: error,
    });
  }
};