/* eslint-disable camelcase */
// eslint-disable-next-line import/named
import { User } from '../models';
import encryptor from '../services/encryptor';
import generator from '../services/tokenGenerator';


/**
 * Class Signup
 */
export default class Signup {
  /**
     *
     * @param {Object} request body
     * @param {Object} response body
     * @returns {JSON} data
     */
  static async register(request, response) {
    try {
      const { first_name, last_name, email } = request.body;

      const encryptedPassword = encryptor(request.body.password);
      // check if email already exist
      const checkEmail = await User.findOne({ where: { email } });
      if (checkEmail) {
        return response.status(409).json({
          status: 409,
          error: `Email '${email}' already exists`
        });
      }
      // store data into db
      const result = await User.create({
        first_name,
        last_name,
        email,
        password: encryptedPassword
      });
      // payloader
      const { password, ...payloader } = result.dataValues;
      // token generator
      const token = generator(payloader);
      // response data
      const {
        id, updatedAt, createdAt, ...data
      } = payloader;
      return response.status(201).json({
        status: 201,
        token,
        data
      });
    } catch (error) {
      console.log(error);
      return response.status(500).json({
        status: 500,
        error: 'Internal server error'
      });
    }
  }
}
