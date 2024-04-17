const mongoose = require("mongoose");


const studentSchema = new mongoose.Schema({
    name:String
})

module.exports = new mongoose.model("Student",studentSchema);