const jwt = require("jsonwebtoken");
const User = require("../schema/userModel");

const superAdminAuth = async(req,res,next)=>{
    // verify there is a authorization headers on the request
    const auth = req.headers.authorization;
    if(!auth){
        return res.status(401).send("Request is not authorized");
    }
    const token = auth && auth.split(" ")[1];
    try{
        const payload = jwt.verify(token,process.env.TOKEN_SECRET);
        if(payload.authLvl === 3){
            next();
        }else{
            throw Error("You are not a superadmin");
        }
    }catch(err){
        res.status(401).send(err.message);
    }
}

module.exports = superAdminAuth;