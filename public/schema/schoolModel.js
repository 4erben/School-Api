const mongoose = require("mongoose");
const {classSchema} = require("./classModel")

const schoolSchema = new mongoose.Schema({
    name:String,
    classes:[classSchema]
})

module.exports = new mongoose.model("School", schoolSchema);