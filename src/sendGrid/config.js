import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';

dotenv.config();

const key = process.env.SENDGRID_API_KEY;

sgMail.setApiKey(key);


export default (email, password) => {
  const msg = {
    to: email,
    from: 'gokayirayol@gmail.com',
    subject: 'Password reset',
    text: `Follow this link ${password} to reset email`
  };
  
};
sgMail.send(msg);