const express = require("express");
const router = express.Router();

const superAdminAuth = require("../middlewares/superAdminAuth");
const {signupUser} = require("../controllers/userController");

router.post("/",superAdminAuth,signupUser);
module.exports = router;