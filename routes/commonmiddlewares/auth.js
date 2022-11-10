import WebAuthenticate from "../api/middleware/auth";
import MobileAuthenticate from "../m-api/middlewares/auth";

export default async (req, res, next) => {
  let { m } = req.query;
  console.log("=======================");
  console.log({ m });
  console.log("in auth middleware");
  console.log("=======================");
  try {
    if (m) WebAuthenticate(req, res, next);
    else MobileAuthenticate(req, res, next);
  } catch (ex) {
    return raiseServerError(res);
  }
};
