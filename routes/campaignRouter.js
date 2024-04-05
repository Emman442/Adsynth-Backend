const { Router } = require("express");
const { createCampaign, fetchUserCampaigns } = require("../controllers/campaignController");
const { protect } = require("../controllers/authController");

const router = Router();

router.post("/", protect, createCampaign);
router.get("/", protect, fetchUserCampaigns);

module.exports = router;
