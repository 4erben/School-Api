const express = require("express");
const router = express.Router();
const lodash = require("lodash");
const { Class } = require("../Models/classModel");
const Student = require("../Models/studentModel");

const School = require("../Models/schoolModel");
const schoolAdminAuth = require("../middlewares/schoolAdmin");




router.route("/")
.get(async(req,res)=>{
    try{ // (?schoolName= & className=)
        const schoolName = lodash.lowerCase(req.query.schoolName);
        const className = lodash.lowerCase(req.query.className);
        const school = await School.findOne({name: schoolName});
        const classe = school.classes.find((c)=> c.name === className);
        if(classe){
            res.status(200).json(classe);
        }
        else{
            res.status(404).json("Class Not Found")
        }
    }catch(err){
        res.status(400).send(err.message);
    }
})
.post(schoolAdminAuth,async(req,res)=>{
    try{ // (className)
        const schoolName = lodash.lowerCase(req.school);
        const className = lodash.lowerCase(req.body.className);
        const school = await School.findOne({name:schoolName})
        const classe = new Class({
            name: className
        });
        school.classes.push(classe);
        await school.save();
        res.status(200).json(classe);
    
    }catch(err){
        res.status(400).send(err.message);
    }
})
.patch(schoolAdminAuth,async(req,res)=>{ // you can modify the class name and add students to the class or remove them from the class
    try{ // (className,newClassName,studentName,removeStudentId)
        const schoolName = lodash.lowerCase(req.school);
        const className = lodash.lowerCase(req.body.className);
        const newClassName = lodash.lowerCase(req.body.newClassName);
        const studentName = lodash.lowerCase(req.body.studentName);
        const removeStudentId = req.body.removeStudentId;

        const student = await Student.findOne({name: studentName});
        const school = await School.findOne({name: schoolName});
        const classe =  school.classes.find(c=> c.name === className);
        //modify the name of the class
        if(newClassName){
            classe.name = newClassName;
        }
        //reference a new student to the class
        if(student){
            classe.students.push(student);
        }
        //remove the reference of a student from the class
        if(removeStudentId){
            classe.students = classe.students.filter(id=>{
                return id.toString() !== removeStudentId;
            }
            )
        }
        await school.save();
        res.send(classe);

    }catch(err){
        res.status(400).json(err.message)
        
    }
})
.delete(schoolAdminAuth,async(req,res)=>{
    const schoolName = lodash.lowerCase(req.school);
    const className = lodash.lowerCase(req.body.className);
    try{ // (className)
            const school = await School.updateOne(
        {name:schoolName},
        {$pull:{classes:{name:className}}}
    );
    res.status(200).json(school);
    }catch(err){
        res.status(400).json(err.message)
    }
})

module.exports = router;
