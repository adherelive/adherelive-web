import WebAuthenticate from "../api/middleware/auth";
import MobileAuthenticate from "../m-api/middlewares/auth";
import { raiseServerError } from "../api/helper";
import { createLogger } from "../../libs/log";

const log = createLogger("MIDDLEWARE > AUTH");

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
  // log.debug("In the auth middle ware -> request query (m): ", { m });

  try {
    if (m) MobileAuthenticate(req, res, next);
    else await WebAuthenticate(req, res, next);
  } catch (ex) {
    return raiseServerError(res);
  }
};
