import { USER_CATEGORY } from "../../../constant";
import { raiseClientError } from "../helper";

export const isProvider = (req, res, next) => {
  const { userDetails: { userData: { category } = {} } = {} } = req;
  if (category !== USER_CATEGORY.PROVIDER) {
    return raiseClientError(res, 401, {}, "UNAUTHORIZED");
  }
  next();
};
