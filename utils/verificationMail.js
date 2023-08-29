const nodemailer = require('nodemailer');

require('dotenv').config();

const mailSg = (email, verificationToken) => {
  const config = {
    host: 'smtp.sendgrid.net',
    // port: 587,
    port: 465,
    // secure: false,
    secure: true,
    // service: 'sendgrid',
    auth: {
      user: 'apikey',
      pass: process.env.API_KEY,
    },
  };

  const transporter = nodemailer.createTransport(config);
  const emailOptions = {
    from: 'beta303tester@gmail.com',
    to: email,
    subject: 'Please verify your email',
    // text: `http://localhost:3000/api/users/verify/${verificationToken}`,
    html:
      '<h1>Almost there</h1><strong>Click <a href="http://localhost:3000/api/users/verify/' +
      verificationToken +
      '">here</a> to confirm your email.</strong>',
  };

  transporter
    .sendMail(emailOptions)
    .then(info => console.log(info))
    .catch(err => console.log(err));
};

module.exports = { mailSg };
