const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  admin_Name: String,
  employee_ID: Number,
  admin_Post: String,
});




module.exports = mongoose.model('admin_infos', adminSchema)