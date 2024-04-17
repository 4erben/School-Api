const mongoose = require("mongoose");

const classSchema = new mongoose.Schema({
    name: String,
    students:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student"
    }]
});

const Class = new mongoose.model("Class",classSchema);
module.exports = {classSchema, Class};
