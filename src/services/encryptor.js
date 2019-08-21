import bcrypt from 'bcryptjs';

/**
 * @description Encryption of data
 * @param {*} data
 */
const salt = bcrypt.genSaltSync(10);

export default (data) => bcrypt.hashSync(data, salt);
