const express = require("express");
const authController = require("../controllers/authController");

const router = express.Router();

router.post("/", authController.loginAuth)
router.get("/refresh", authController.refreshAuth)
router.post("/logout", authController.logoutAuth)
module.exports = router;