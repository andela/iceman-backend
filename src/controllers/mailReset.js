import { User } from '../models';

export const forgotPassword = (req, res) => {
  // const { body: { email } } = req;
  console.log(User.findAll());
}
