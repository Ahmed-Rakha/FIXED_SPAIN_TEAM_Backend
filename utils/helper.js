const mongoose = require('mongoose');
const User = require('../models/user/userManagement.user.model');
const nodemailer = require('nodemailer'); 
const ejs = require('ejs'); 
const path = require('path');
// Utility function to find user by ID or email

exports.findUser = async (identifier) => {
  if (mongoose.Types.ObjectId.isValid(identifier)) {
    return await User.findById(identifier).select('-password');
  } else {
    return await User.findOne({ email: identifier }).select('-password');
  }
};

// configure nodemailer 

let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD
  }
})

const sendEmail = async (options) => {
  const html = await ejs.renderFile(path.join(__dirname, '..','views', 'reset-password.ejs'), {
    resetUrl: options.resetUrl
  })
  let mailOptions = {
    from: process.env.EMAIL,
    to: options.email,
    subject: options.subject,
    html
  }
  try {
    await transporter.sendMail(mailOptions)
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

module.exports = sendEmail