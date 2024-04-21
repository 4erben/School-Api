require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const swaggerUI = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDoc = YAML.load("./api-docs/swagger.yaml");

//Routes
const schoolRouter = require("./public/routes/schoolRoute");
const schoolsRouter = require("./public/routes/schoolsRoute");
const classRouter = require("./public/routes/classRoute");
const studentsRouter = require("./public/routes/studentsRoute");
const studentRouter = require("./public/routes/studentRoute");
const signupRouter = require("./public/routes/signupRoute");
const signinRouter = require("./public/routes/signinRoute");

//initializing the app instance
const app = express();
const port = process.env.PORT ||3000;

//using the middlewares
app.use(express.json());
app.use(express.static("public"));
app.use("/api-docs",swaggerUI.serve,swaggerUI.setup(swaggerDoc));


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

//using the routes
app.use("/school",schoolRouter);
app.use("/schools",schoolsRouter);
app.use("/class",classRouter);
app.use("/students",studentsRouter);
app.use("/student",studentRouter);
app.use("/signup",signupRouter);
app.use("/signin",signinRouter);







connectDB().then(()=>{
    app.listen(port,()=>{
    console.log("app started on port", port);
})
})