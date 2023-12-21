const nodemailer = require('nodemailer');
const jwt = require("jsonwebtoken");
require("dotenv").config();

const transporter = nodemailer.createTransport({
    service : 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth:{
        user: process.env.MAIL_USERNAME,
        pass : process.env.MAIL_PASSWORD
    } 
});

function emailToken(userId){
  const emailToken = jwt.sign(
      {
          user : { id : userId },
      },
      process.env.EMAIL_SECRET,
      {
          expiresIn:'1d',
      }
  );

  return emailToken; 
}

const sendConfirmationEmail = async (id ,email) => {
    const eToken = emailToken(id);
    const url = `http://localhost:3000/confirmation/${eToken}`;
  
    try {
      // Send the confirmation email
      await transporter.sendMail({
        to: email,
        subject: 'Confirm Email',
        html: `Please click this email to confirm your email: <a href="${url}">${url}</a>`,
      });
  
      console.log('Confirmation email sent successfully.');
    } catch (error) {
      console.error('Error sending confirmation email:', error);
      // Handle the error (e.g., log it, return an error response)
    }
  };

module.exports = sendConfirmationEmail;