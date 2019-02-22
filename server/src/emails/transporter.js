const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: "annabel.beier13@ethereal.email",
    pass: "v3cjBFSMw6zkfpMMYn"
  }
});

module.exports = transporter;
