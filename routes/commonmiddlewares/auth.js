import WebAuthenticate from "../api/middleware/auth";
import MobileAuthenticate from "../m-api/middlewares/auth";

export default async (req, res, next) => {
  try {
    await WebAuthenticate(req, res, next);
    next();
  } catch (err) {
    await MobileAuthenticate(req, res, next);
    next();
  }
};
