import crypto from 'crypto';
import { sendMail } from './index';

const randomString = () => crypto.randomBytes(11).toString('hex');
const emailVerificationToken = randomString();


const user = {
  firstName: 'Amos',
  lastName: 'Oruaroghene',
  email: 'inspiron.amos@gmail.com'
};

const data = {
  templateName: 'verify_email',
  sender: '"BareFoot Nomad" <support@barefootnomad.com>',
  receiver: `${user.email}`,
  name: `${user.firstName} ${user.lastName}`,
  verify_email: `${process.env.APP_URL}/verify?activate=${emailVerificationToken}`

};

sendMail(data);
