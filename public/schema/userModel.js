const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");



//creating the user schema
const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    displayName:{
        type:String,
        required:true
    },
    authLvl:{ // authLvl is 3 lvls , from 1 to 3 , 1 is lowest authorized user , 3 is super admin , 2 is school admin
        type:Number,
        required:true
    },
    school:{
        type: String,
        required:true
    }
});

//make a signup method for users

userSchema.statics.signup = async function(username,password,displayName,school,authLvl){
    if(!username || !password || !displayName || !school || !authLvl ){
        throw Error("All fields must be filled!")
    }
/*     if(!validator.isStrongPassword(password)){
        throw Error("Enter A Strong Password!")
    } */
    const exist = await this.findOne({username});
    if(exist){
        throw Error("This user already exist!")
    }
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password,salt);

    const email = await this.create({
        username:username,
        password:hash,
        displayName:displayName,
        school:school,
        authLvl:authLvl
    });
    return email;
}


userSchema.statics.login = async function(username,password){
    if(!username || !password){
        throw Error("All fields must be filled!")
    };
    const email = await this.findOne({username});
    if(!username){
        throw Error("user or password is wrong!");
    };
    const match = await bcrypt.compare(password,email.password);
    if(!match){
        throw Error("user or password is wrong!")
    }
    return email;
}   


module.exports = new mongoose.model("User",userSchema);