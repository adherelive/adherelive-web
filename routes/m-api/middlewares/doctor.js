import {USER_CATEGORY} from "../../../constant";
import {raiseClientError} from "../helper";

export const isDoctor = (req, res, next) => {
    const {userDetails: {userData: {category} = {}} = {}} = req;
    if(category !== USER_CATEGORY.DOCTOR && category !== USER_CATEGORY.HSP) {
        return raiseClientError(res, 401, {}, "UNAUTHORIZED");
    }
    next();
};