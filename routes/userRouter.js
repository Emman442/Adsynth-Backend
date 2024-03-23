const {Router} = require("express"); 
const { signUp, Login, login, protect, ge } = require("../controllers/authController");
const { saveUserWebsiteDetails, getUserWebsite, getTagSetUp, AddTagSetUp } = require("../controllers/userController");
const router = Router()


router.post("/signup", signUp)
router.post("/login", login)
router.put("/save-website",protect, saveUserWebsiteDetails)
router.get("/get-website",protect, getUserWebsite )
router.get("/get-webtag",protect, getTagSetUp)
router.put("/add-webtag",protect, AddTagSetUp)

module.exports = router;