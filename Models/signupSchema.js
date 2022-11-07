const mongoose = require('mongoose')

const signupSchema = new mongoose.Schema({
    Employee_ID : Number,
    Admin_Name : String,
    Phone : Number,
    Email : String,
    Password : String,
    Confirm_Password : String
})


module.exports = mongoose.model('admin_reg', signupSchema)