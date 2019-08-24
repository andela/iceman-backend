import { sendMail } from './index';

/**
* Input validation logic
* @param {object} user - user details
* @return {json} - mail message
*/
const send = async (user) => {
  const data = {
    templateName: 'verify_email',
    sender: '"BareFoot Nomad" <support@barefootnomad.com>',
    receiver: `${user.email}`,
    name: `${user.first_name} ${user.last_name}`,
    confirm_account__url: `${process.env.APP_URL}/verify?activate=${user.token}&&id=${user.id}`
  };

  sendMail(data);
};
export default send;
