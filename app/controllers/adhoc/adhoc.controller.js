
// services
import userService from "../../services/user/user.service";
import userRolesService from "../../services/userRoles/userRoles.service";

// wrappers
import UserWrapper from "../../ApiWrapper/web/user";

import { getCategoryDetails } from "./adhoc.helper";
import Controller from "../";
import Logger from "../../../libs/log";

const Log = new Logger("WEB > ADHOC > CONTROLLER");

class AdhocController extends Controller {
    constructor() {
        super();
    }

    migrateAllUsersToUserRoles = async (req, res) => {
        try {
            const users = await userService.getAll();
            if(users && users.length) {
                for(let i=0; i< users.length; i++) {
                    const user = await UserWrapper(users[i]);
                    const userId = user.getId();
                    const category = user.getCategory();
                    const categoryData = await getCategoryDetails(category, userId);

                    const { category_id = null} = categoryData || {};

                    const userRole = await userRolesService.create({
                        id: userId,
                        user_identity: userId,
                        category_id,
                        category_type: category
                    });
                }
            }
            return this.raiseSuccess(res, 200, {}, "All users migrated successfully to user roles.");
        } catch (error) {
            Log.debug("migrateAllUsersToUserRoles 50 error", error);
            return this.raiseServerError(res, 500, {}, "Error in migrating users data to user roles.");
        }
    }

    testApi = async (req, res) => {
        try {
            const { userDetails: {userId,
                userRoleId,
                userRoleData,
                userData = {},
                userCategoryData = {}} = {}} = req;

            return this.raiseSuccess(res, 200, {
                userRoleId, userRoleData,
                userId, userData, userCategoryData
            }, "Test api successfull.");
        } catch (error) {
            Log.debug("testApi 500 error", error);
            return this.raiseServerError(res, 500, {}, "Error in test api.");
        }
    }
}

export default new AdhocController();
