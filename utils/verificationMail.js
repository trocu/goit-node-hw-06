const nodemailer = require('nodemailer');

require('dotenv').config();

const mailSg = (email, verificationToken) => {
  const config = {
    host: 'smtp.sendgrid.net',
    port: 465,
    secure: true,
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
    html:
      '<h1>Almost there!</h1><strong>Click <a href="http://localhost:3000/api/users/verify/' +
      verificationToken +
      '">here</a> to confirm your email and see the magic happen</strong>',
  };

  transporter.sendMail(emailOptions).catch(err => console.log(err));
};

module.exports = { mailSg };
