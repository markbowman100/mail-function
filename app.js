"use strict";
const nodemailer = require("nodemailer");

exports.sendEmail = (req, res) => {

  res.set('Access-Control-Allow-Origin', '*');

  if (req.method === 'OPTIONS') {
    // Send response to OPTIONS requests
    res.set('Access-Control-Allow-Methods', 'POST');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.set('Access-Control-Max-Age', '3600');
    res.status(204).send('');
  } else {
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
  }
};

async function sendEmail(name, email, subject, message) {
  let credentials = {
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
  };
  let transporter = nodemailer.createTransport(credentials);
  // send mail with defined transport object
  const emailTemplate = {
    from: `${email}`,
    to: process.env.EMAIL_USERNAME,
    subject: subject,
    text: `${name} ${email}:${message}`,
    html: `<p>${name} ${email}:${message}</p>`
  };
  let info = await transporter.sendMail(emailTemplate);
  return info;
}