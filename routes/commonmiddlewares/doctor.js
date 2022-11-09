import { isDoctor as isWebDoctor } from "../api/middleware/doctor";
import { isDoctor as isMDoctor } from "../m-api/middlewares/doctor";

export const isDoctor = (req, res, next) => {
  let { m } = req.query;
  try {
    if (m) isMDoctor(req, res, next);
    else isWebDoctor(req, res, next);
  } catch (ex) {
    return raiseServerError(res);
  }
};
