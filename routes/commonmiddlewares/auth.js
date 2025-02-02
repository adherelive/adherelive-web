import WebAuthenticate from "../api/middleware/auth";
import MobileAuthenticate from "../m-api/middlewares/auth";

/**
 *
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
export default async (req, res, next) => {
  let { m } = req.query;
  // console.log("In the auth middle ware ---> request query (m): ", { m });

  try {
    if (m) MobileAuthenticate(req, res, next);
    else WebAuthenticate(req, res, next);
  } catch (ex) {
    return raiseServerError(res);
  }
};
