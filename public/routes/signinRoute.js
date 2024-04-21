const express = require("express");
const router = express.Router();

const {loginUser} = require("../controllers/userController");

router.post("/",loginUser);

module.exports = router;