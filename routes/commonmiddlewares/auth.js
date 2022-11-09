import WebAuthenticate from "../api/middleware/auth";
import MobileAuthenticate from "../m-api/middlewares/auth";

export default async (req, res, next) => {
  let { m } = req.query;
  console.log("=======================");
  console.log({ m });
  console.log("=======================");
  try {
    if (m) MobileAuthenticate(req, res, next);
    else WebAuthenticate(req, res, next);
  } catch (ex) {
    return raiseServerError(res);
  }
};
