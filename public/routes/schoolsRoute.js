const express = require("express");
const router = express.Router();

const School = require("../Models/schoolModel");

router.route("/")
.get(async(req,res)=>{
    try{
        const schools = await School.find();
        res.status(200).json(schools);
    }catch(err){
        res.status(400);
        throw Error({error: err.message});
    }
})

module.exports = router;