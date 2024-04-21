const jwt = require("jsonwebtoken");
const User = require("../Models/userModel");

const schoolAdminAuth = async(req,res,next)=>{
    const auth = req.headers.authorization;
    if(!auth){
        return res.status(401).send("Request is not authorized");
    }
    const token = auth && auth.split(" ")[1];
    try{
        const payload = jwt.verify(token,process.env.TOKEN_SECRET);
        const {authLvl,school} = payload;
        if(authLvl === 2){
            req.school = school;
            next();
        }else{
            throw Error("You are not an admin");
        }
    }catch(err){
        res.status(401).send(err.message);
    }
}
module.exports = schoolAdminAuth;