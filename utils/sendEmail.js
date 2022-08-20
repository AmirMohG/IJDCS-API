const nodemailer = require("nodemailer");
var smtpTransport = require('nodemailer-smtp-transport');
const sendEmail = (options) => {
  var transporter = nodemailer.createTransport(smtpTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    auth: {
      user: "",
      pass: ""
    }
  }));

  const mailOptions = {
    from: "",
    to: options.to,
    subject: options.subject,
    html: options.text,
  };

  transporter.sendMail(mailOptions, function (err, info) {
    if (err) {
      console.log(err);
    } else {
      console.log(info);
    }
  });
};

module.exports = sendEmail;
