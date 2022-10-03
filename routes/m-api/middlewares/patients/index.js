import { USER_CATEGORY } from "../../../../constant";
import { raiseClientError } from "../../helper";

export default async (req, res, next) => {
  const { userDetails: { userData: { category } = {} } = {} } = req;

  if (category !== USER_CATEGORY.PATIENT) {
    return raiseClientError(res, 401, {}, "UNAUTHORIZED");
  }
  next();
};
