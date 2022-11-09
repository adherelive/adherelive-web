import WebAuthenticate from "../api/middleware/auth";
import MobileAuthenticate from "../m-api/middlewares/auth";

export default async (req, res, next) => {
  let { m } = req.query;
  try {
    if (m) MobileAuthenticate(req, res, next);
    else WebAuthenticate(req, res, next);
  } catch (ex) {
    return raiseServerError(res);
  }
};
