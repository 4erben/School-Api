const express = require("express");
const router = express.Router();

const Student = require("../Models/studentModel");

router.get("/",async(req,res)=>{
    const students = await Student.find();
    res.status(200).json(students);
})


module.exports = router;