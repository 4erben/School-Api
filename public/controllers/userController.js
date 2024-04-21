const User = require("../Models/userModel");
const jwt = require("jsonwebtoken");

const createToken = (payload)=>{
    return jwt.sign(
        payload,
        process.env.TOKEN_SECRET,
        {expiresIn:"1d"}
    )
}



//signup controller
const signupUser = async (req,res)=>{
const {username,password,displayName,school,authLvl = 1} = req.body;
try{
    const email = await User.signup(username,password,displayName,school,authLvl);
    //create the token
    const token =  createToken({_id:email._id,authLvl:authLvl,school:school});
    res.status(200).json({username,displayName,token})
}catch(err){
    res.status(400).send(err.message);
}
}


//login controller
const loginUser = async (req,res)=>{
    const { username , password} = req.body;
    try{
        const email = await User.login(username,password);
        const {displayName, authLvl, school ,_id} = email;
        //create the token
        const token = createToken({_id:_id,authLvl:authLvl,school:school});
        res.status(200).json({displayName,username,authLvl,school,token})

    }catch(err){
        res.status(400).send(err.message);
    }
}

module.exports = {signupUser,loginUser};