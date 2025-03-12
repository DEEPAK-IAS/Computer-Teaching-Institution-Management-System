const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema({
  name : {
    type: String,
    required: true,
    trim: true
  }, 
  email : {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    required: true
  },
  password : {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  role: {
    type: String,
    required: true
  },
  otp: { type: String },
  otpExpire: { type: Number },
}, {
  timestamps: true
});

const Admin = mongoose.model("Admin", AdminSchema);

module.exports = Admin;