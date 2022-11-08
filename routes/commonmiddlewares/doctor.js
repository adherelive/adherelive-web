import { isDoctor as isWebDoctor } from "../api/middleware/doctor";
import { isDoctor as isMDoctor } from "../m-api/middlewares/doctor";

export const isDoctor = (req, res, next) => {
  try {
    console.log("In Common MiddleWare dr -1");
    isWebDoctor(req, res, next);
    console.log("In Common MiddleWare dr -2");
  } catch (ex) {
    console.log("In Common MiddleWare dr -3");
    try {
      console.log("In Common MiddleWare dr -4");
      isMDoctor(req, res, next);
      console.log("In Common MiddleWare dr -5");
    } catch (ex) {
      console.log("In Common MiddleWare dr -6");
      return raiseServerError(res);
    }
  }
};
