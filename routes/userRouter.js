const { Router } = require("express");
const { signUp, login, protect, ge } = require("../controllers/authController");
const {
  saveUserWebsiteDetails,
  getUserWebsite,
  getTagSetUp,
  AddTagSetUp,
  saveUserFacebookDetails,
  saveUserGoogleDetails,
  UpdateUserProfile,
  fetchUser,
} = require("../controllers/userController");
const router = Router();

router.post("/signup", signUp);
router.post("/login", login);
router.put("/save-website", protect, saveUserWebsiteDetails);
router.get("/get-website", protect, getUserWebsite);
router.get("/get-webtag", protect, getTagSetUp);
router.put("/add-webtag", protect, AddTagSetUp);
router.put("/save-facebook", protect, saveUserFacebookDetails);
router.put("/save-google", protect, saveUserGoogleDetails);
router.put("/update-me", protect, UpdateUserProfile);
router.get("/me", protect, fetchUser);

module.exports = router;
