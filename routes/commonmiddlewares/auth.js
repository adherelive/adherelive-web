import WebAuthenticate from "../api/middleware/auth";
import MobileAuthenticate from "../m-api/middlewares/auth";

export default async (req, res, next) => {
  try {
    console.log("In Common MiddleWare auth -1");
    await WebAuthenticate(req, res, next);
    console.log("In Common MiddleWare auth -2");
  } catch (err) {
    console.log("In Common MiddleWare auth -6");
    try {
      console.log("In Common MiddleWare auth -3");
      await MobileAuthenticate(req, res, next);
      console.log("In Common MiddleWare auth -4");
      next();
    } catch (ex) {
      console.log("In Common MiddleWare auth -5");
      return raiseServerError(res);
    }
  }
};
