import { isDoctor as isWebDoctor } from "../api/middleware/doctor";
import { isDoctor as isMDoctor } from "../m-api/middlewares/doctor";

export const isDoctor = (req, res, next) => {
  try {
    isWebDoctor(req, res, next);
    next();
  } catch (ex) {
    isMDoctor(req, res, next);
    next();
  }
};
