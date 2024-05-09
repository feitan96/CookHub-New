// Import modules using ES Module syntax
import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import nodemailer from 'nodemailer';
import cors from 'cors';
import crypto from 'crypto';  // To generate tokens

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

// Setup email transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'andre.erasmo02@gmail.com',
        pass: 'abrf tufh goir aepq'
    }
});

// Helper function to generate a secure token
function generateToken() {
    return crypto.randomBytes(20).toString('hex');
}

// Password reset route
app.post('/reset-pass', async (req, res) => {
    const { email } = req.body;
    const token = generateToken(); // Generate a unique token for the session

    // Assuming the frontend URL where the user resets their password is:
    const resetLink = `http://localhost:5173/reset-pass?token=${token}&email=${encodeURIComponent(email)}`;

    var mailOptions = {
        from: 'andre.erasmo.photography@gmail.com',
        to: email,
        subject: 'Password Reset Request',
        text: `To reset your password, please click on the following link: ${resetLink}`,
        html: `<p>To reset your password, please click on the link below:</p><p><a href="${resetLink}">${resetLink}</a></p>`
    };
    
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(error);
            res.status(500).send("Error sending email: " + error.message);
        } else {
            console.log('Email sent: ' + info.response);
            res.send('Reset link sent successfully. Please check your email.');
        }
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
