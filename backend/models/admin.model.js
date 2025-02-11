const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema({
  adminName : {
    type: String,
    required: true,
    trim: true
  }, 
  adminMail : {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    required: true
  },
  adminPassword : {
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
  }
}, {
  timestamps: true
});

const Admin = mongoose.model("Admin", AdminSchema);

module.exports = Admin;