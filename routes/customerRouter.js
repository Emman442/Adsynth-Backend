const { Router } = require("express");
const { protect } = require("../controllers/authController");
const { createCustomer } = require("../controllers/customerController");
const router = Router();


router.post('/', protect, createCustomer)



module.exports = router;
