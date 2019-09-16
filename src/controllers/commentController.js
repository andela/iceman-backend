import Response from '../utils/response';
import CommentService from '../services/commentService';

const { createComment, getComment, deleteComment } = CommentService;
const { success, badRequest } = Response;

/**
 * Controller form request comments
 */
export default class CommentController {
/**
 * @param {object} req - request object
 * @param {object} res - response object
 * @return {object} user - return object containing status and data
 */
  static async postComment(req, res) {
    try {
      const data = await createComment(req);

      success(res, data, 201);
    } catch ({ message: error }) {
      badRequest(res, error);
    }
  }

  /**
 * @param {object} req - request object
 * @param {object} res - response object
 * @returns {object} user - return object containing status and data
 */
  static async getComment(req, res) {
    try {
      const data = await getComment(req);

      success(res, data);
    } catch ({ message: error }) {
      badRequest(res, error);
    }
  }

  /**
 * @param {object} req - request object
 * @param {object} res - response object
 * @returns {object} user - return object containing status and data
 */
  static async deleteComment(req, res) {
    try {
      const data = await deleteComment(req);

      success(res, data);
    } catch ({ message: error }) {
      badRequest(res, error);
    }
  }
}
