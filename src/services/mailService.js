import dotenv from 'dotenv';
import sgMail from '@sendgrid/mail';

dotenv.config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const templates = {
  verify_email: process.env.EMAIL_TEMPLATE_ID,
};

export const sendMail = async (data) => {
  const message = {
    to: data.receiver,
    from: data.sender,
    templateId: templates[data.templateName],

    dynamic_template_data: {
      name: data.name,
      verify_email: data.confirm_account__url,
    }
  };
  try {
    await sgMail.send(message);
    console.log('message sent');
  } catch (err) {
    throw new Error(err);
  }
};

export default sendMail;
