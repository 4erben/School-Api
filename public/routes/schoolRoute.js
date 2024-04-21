const express = require("express");
const router = express.Router();
const lodash = require("lodash");

const School = require("../Models/schoolModel");
const superAdminAuth = require("../middlewares/superAdminAuth");

router.route("/")
.get(async(req,res)=>{
    try{ // enter query.name (?name=)
        const schoolName = lodash.lowerCase(req.query.name);
        const school = await School.findOne({name: schoolName});
        if(school){
            res.status(200).json(school);
        }
        else{
            res.status(404).json("Couldnt find a school with such name");
        }
    }catch(err){
        res.status(400).send(err.message);
    }
})
.post(superAdminAuth,async(req,res)=>{
    try{ // enter (schoolName)
        const  schoolName  = lodash.lowerCase(req.body.schoolName);
        const newSchool = new School({
            name: schoolName
        });
        await newSchool.save();
        res.status(200).json(newSchool);
    }catch(err){
        res.status(400).send(err.message);
        
    }
})
.patch(superAdminAuth,async(req,res)=>{
    try{ //enter existed school name and new name (schoolName, newName)
        const schoolName = lodash.lowerCase(req.body.schoolName);
        const newName = lodash.lowerCase(req.body.newName);
        const school = await School.findOneAndUpdate(
            {name: schoolName},
            {$set:{
                name: newName
            }}
        );
        res.status(200).json(school);
    }catch(err){
        res.status(400).send(err.message);
    }
})
.delete(superAdminAuth,async(req,res)=>{
    try{ // (schoolName)
        const schoolName = lodash.lowerCase(req.body.schoolName);
        const school = await School.deleteOne({name: schoolName});
        res.status(200).json(school);
    }catch(err){
        res.status(400).send(err.message);
    }
});

module.exports = router;