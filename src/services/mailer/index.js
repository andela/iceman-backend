import dotenv from 'dotenv';
import sgMail from '@sendgrid/mail';

dotenv.config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const templates = {
  verify_email: 'd-1903b0acf59940cea2618e012f891007',
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
