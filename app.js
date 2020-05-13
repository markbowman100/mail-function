"use strict";
const nodemailer = require("nodemailer");

exports.sendEmail = (req, res) => {
  let name = req.body.name;
  let email = req.body.email;
  let subject = req.body.subject;
  let message = req.body.message;
  if(name !== undefined && name !== null && 
    email !== undefined && email !== null && 
    subject !== undefined && subject !== null && 
    message !== undefined && message !== null) {

    sendEmail(name, email, subject, message).then(() => {
      res.status(200).send();
    }).catch((err) => {
      res.status(500).send(err);
    })
  }
  else {
    res.status(400).send("Missing mandatory fields");
  }
};

async function sendEmail(name, email, subject, message) {
  let transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    },
    tls: {
        rejectUnauthorized: process.env.EMAIL_REJECT_UNAUTHORIZED
    }
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: `${name}: ${email}`,
    to: process.env.EMAIL_USERNAME,
    subject: subject,
    text: message,
    html: `<p>${message}</p>`
  });

  return info;
}