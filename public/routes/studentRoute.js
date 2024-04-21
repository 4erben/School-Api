const express = require("express");
const router = express.Router();
const lodash = require("lodash");

const Student = require("../Models/studentModel");
const schoolAdminAuth = require("../middlewares/schoolAdmin");


router.route("/")
.get(async(req,res)=>{//(?name=)
    const studentName = lodash.lowerCase(req.query.name);
    const student = await Student.findOne({name:studentName});
    res.status(200).json(student);
})
.post(schoolAdminAuth,async(req,res)=>{
    try{//(studentName)
    const studentName = lodash.lowerCase(req.body.studentName);
    //create the student on the database 
    const student = new Student({
        name: studentName
    });
    await student.save();
    res.status(200).json(student);
    }catch(err){
        res.status(400).send(err.message);
    }
})
.patch(schoolAdminAuth,async(req,res)=>{
    try{//(studentName,newName)
        const studentName = lodash.lowerCase(req.body.studentName);
        const newName = lodash.lowerCase(req.body.newName);
        const student = await Student.updateOne(
            {name:studentName},
        {
            $set:{name:newName}
        })
        res.status(200).json(student);
    }catch(err){
        res.status(400).send(err.message);
    }
})
.delete(schoolAdminAuth,async(req,res)=>{
    try{//(studentName)
        const studentName = lodash.lowerCase(req.body.studentName);
        const student = await Student.deleteOne({name:studentName});
        res.status(200).json(student);
    }catch(err){
        res.status(400).send(err.message);
    }
})

module.exports = router;