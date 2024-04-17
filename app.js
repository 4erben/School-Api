require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const School = require("./public/schema/schoolModel");
const Student = require("./public/schema/studentModel");
const { Class} = require("./public/schema/classModel");
const {signupUser,loginUser} = require("./public/controllers/userController");
const lodash = require("lodash");
const superAdminAuth = require("./public/middlewares/superAdminAuth");
const schoolAdminAuth = require("./public/middlewares/schoolAdmin");

const app = express();
const port = process.env.PORT ||3000;

app.use(express.json());
app.use(express.static("public"))
//connecting to the mongodb 
const connectDB = async()=>{
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected:${conn.connection.host}`);
    }catch(err){
        console.log(err);
        process.exit(1);
    }
}


app.get("/schools",async(req,res)=>{
    try{
        const schools = await School.find();
        res.status(200).json(schools);
    }catch(err){
        res.status(400);
        throw Error({error: err.message});
    }
})


app.route("/school")
.get(async(req,res)=>{
    try{ // enter query.name (?name=)
        const schoolName = lodash.lowerCase(req.query.name);
        const school = await School.findOne({name: schoolName});
        res.status(200).json(school);
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
        const school = await School.updateOne(
            {name: schoolName},
            {$set:{
                name: newName
            }}
        )
    }catch(err){
        res.status(400).send(err.message);
    }
})
.delete(superAdminAuth,async(req,res)=>{
    try{ // (schoolName)
        const schoolName = lodash.lowerCase(req.body.schoolName);
        const school = await School.deleteOne({name: schoolName});
    }catch(err){
        res.status(400).send(err.message);
    }
});


// endpoint for classes
app.route("/class")
.get(async(req,res)=>{
    try{ // (?schoolName= & className=)
        const schoolName = lodash.lowerCase(req.query.schoolName);
        const className = lodash.lowerCase(req.query.className);
        const school = await School.findOne({name: schoolName});
        const classe = school.classes.find((c)=> c.name === className);
        console.log(school);
        res.status(200).send(classe);
    }catch(err){
        res.status(400).send(err.message);
    }
})
.post(schoolAdminAuth,async(req,res)=>{
    try{ // (className)
        const schoolName = lodash.lowerCase(req.school);
        console.log(schoolName);
        const className = lodash.lowerCase(req.body.className);
        const school = await School.findOne({name:schoolName})
        console.log(school);
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

//endpoint for all students 

app.get("/students",async(req,res)=>{
    const students = await Student.find();
    res.status(200).json(students);
})

//endpoint for specific student


app.route("/student")
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
    try{//(studentName)
        const studentName = lodash.lowerCase(req.body.studentName);
        const student = await Student.updateOne(
            {name:studentName},
        {
            $set:{name:studentName}
        })
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



// endpoint for signup
app.post("/signup",superAdminAuth,signupUser)

//endpoint for login
app.post("/signin",loginUser)




connectDB().then(()=>{
    app.listen(port,()=>{
    console.log("app started on port", port);
})
})