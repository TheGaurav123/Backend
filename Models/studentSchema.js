const mongoose = require('mongoose')



const studentSchema = new mongoose.Schema({
    Student_Name : String,
    Father_Name : String,
    Mother_Name : String,
    Aadhaar : Number,
    Phone : Number,
    DOB : String,
    Course : String,
    Branch : String,
    Email : String
})



module.exports = mongoose.model('studentdatas', studentSchema)