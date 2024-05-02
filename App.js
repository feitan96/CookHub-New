// Import modules using ES Module syntax
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import bodyParser from 'body-parser';
import nodemailer from 'nodemailer';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

// Setup your email transporter
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'andre.erasmo02@gmail.com',
      pass: 'abrf tufh goir aepq'
    }
  });

// Password reset route
app.post('/reset-pass', async (req, res) => {
  const { email } = req.body;
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'andre.erasmo02@gmail.com',
      pass: 'abrf tufh goir aepq'
    }
  });
  var mailOptions = {
    from: 'andre.erasmo.photography@gmail.com',
    to: 'andre.erasmo.photography@gmail.com',
    subject: 'Sending Email using Node.js',
    text: 'That was easy!'
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});