import { isDoctor as isWebDoctor } from "../api/middleware/doctor";
import { isDoctor as isMDoctor } from "../m-api/middlewares/doctor";
import {raiseServerError} from "../api/helper";
import { createLogger } from "../../libs/log";

const log = createLogger("MIDDLEWARE > DOCTOR");

/**
 *
 *
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
export const isDoctor = (req, res, next) => {
  let { m } = req.query;
  // log.debug("In the Doctor middle ware -> request query (m): ", { m });

  try {
    if (m) isMDoctor(req, res, next);
    else isWebDoctor(req, res, next);
  } catch (ex) {
    return raiseServerError(res);
  }
};
