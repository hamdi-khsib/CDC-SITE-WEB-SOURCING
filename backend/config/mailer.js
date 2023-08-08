const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'khsib.hamdi@esprit.tn',
    pass: 'zdvnjfccrdqqrzgo',
  },
});

module.exports = transporter;