/* eslint-disable camelcase */
// eslint-disable-next-line import/named
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models';
import encryptor from '../services/encryptor';
import generator from '../services/tokenGenerator';
import send from '../services/mailer/onSignup';
// import User from '../models/User';

dotenv.config();


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
        updatedAt, createdAt, ...data
      } = payloader;
      const user = {
        id: payloader.id,
        email,
        first_name,
        last_name,
        token
      };
      await send(user);
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

  /**
     *
     * @param {Object} req body
     * @param {Object} res body
     * @returns {JSON} data
     */
  static async verify(req, res) {
    try {
      const { activate, id } = req.query;
      console.log(User);

      const verify = jwt.verify(activate, process.env.JWTSECRET, (err, decoded) => decoded);
      const is_user = await User.findOne({ where: { id: Number(id) } });
      // console.log(user);
      // console.log(user.dataValues.is_verified, '========> uuu');

      if (!is_user.dataValues) {
        return res.status(200).json({
          message: 'user not find, please sign up'
        });
      }


      if (!verify && !is_user.dataValues.is_verified) {
        const { password, ...payloader } = is_user.dataValues;
        const token = generator(payloader);
        // user.dataValues.token = token;
        const user = {
          token,
          email: is_user.dataValues.email,
          first_name: is_user.dataValues.first_name,
          last_name: is_user.dataValues.last_name
        };
        await send(user);
        return res.status(200).json({
          message: 'Expired or Invalid Verification Link. Check your Email For a new verification Link'
        });
      }

      if (is_user.dataValues.is_verified) {
        return res.status(200).json({
          message: 'user is already verified'
        });
      }

      await User.update({ is_verified: true }, { where: { email: verify.email } });

      return res.status(200).json({
        message: 'Email Successfully Verified'
      });
    } catch (error) {
      throw new Error(error);
    }
  }
}
