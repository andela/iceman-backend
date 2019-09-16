import db from '../models';
import Response from '../utils/response';

const { error } = Response;

/**
 * Comment Service class
 */
export default class CommentService {
/**
 * @param {string} comment user comment on request
 * @param {integer} requestId request id
 * @param {integer} userId user id
 * @returns {void}
 */
  static async createComment({ body: { comment }, params: { requestId }, user: { id } }) {
    const checkRequest = await db.Request.findOne({ where: { id: requestId } });

    if (checkRequest === null) error('Request does not exist');

    const { userId } = checkRequest;
    const userDept = await db.UserDepartment.findOne({
      include: [db.Department], where: { userId }
    });
    const { dataValues: { Department: { dataValues: { manager } } } } = userDept;

    if (id !== manager && id !== userId)error('You cannot comment on this request');

    const result = await db.Comment.create({ comment, requestId, userId: id });

    return result;
  }

  /**
   * @param {integer} requestId the request id
   * @returns {void}
   */
  static async getComment({ params: { requestId }, user: { id } }) {
    const checkRequest = await db.Request.findOne({ where: { id: requestId } });

    if (checkRequest === null) error('Request does not exist');

    const { userId } = checkRequest;
    const userDept = await db.UserDepartment.findOne({
      include: [db.Department], where: { userId }
    });
    const { dataValues: { Department: { dataValues: { manager } } } } = userDept;

    if (id !== manager && id !== userId)error('You cannot see these comments');

    const result = await db.Comment.findAll({
      where: {
        deleted: false, requestId
      }
    });

    if (!result.length) error('The are no comments on this request');

    return result;
  }

  /**
   * @param {integer} userId user id
   * @param {integer} commentId comment id
   * @param {integer} requestId request id
   * @returns {void}
   */
  static async deleteComment({ params: { commentId, requestId }, user: { id } }) {
    const checkRequest = await db.Request.findOne({ where: { id: requestId } });

    if (checkRequest === null) error('Request does not exist');

    const checkComment = await db.Comment.findOne({ where: { id: commentId } });

    if (checkComment === null) error('Comment does not exist');

    const { userId, requestId: request } = checkComment;

    if (userId !== id) error('This Comment is not yours');
    if (request.toString() !== requestId) error('Incorrect request id');


    await db.Comment.update({
      deleted: true,
    }, {
      where: {
        userId: id, id: commentId, requestId
      }
    });

    return 'Comment deleted';
  }
}
