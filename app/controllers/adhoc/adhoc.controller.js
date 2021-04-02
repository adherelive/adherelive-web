
// services
import userService from "../../services/user/user.service";
import profileService from "../../services/profiles/profiles.service";

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

    migrateAllUsersToProfile = async (req, res) => {
        try {
            const users = await userService.getAll();
            if(users && users.length) {
                for(let i=0; i< users.length; i++) {
                    const user = await UserWrapper(users[i]);
                    const userId = user.getId();
                    const category = user.getCategory();
                    const categoryData = await getCategoryDetails(category, userId);

                    const { category_id = null} = categoryData || {};

                    const profile = await profileService.createProfile({
                        user_id: userId,
                        category_id,
                        category_type: category
                    });
                }
            }
            return this.raiseSuccess(res, 200, {}, "All users migrated successfully to profiles.");
        } catch (error) {
            Log.debug("migrateAllUsersToProfile 50 error", error);
            return this.raiseServerError(res, 500, {}, "Error in migrating users data to profiles.");
        }
    }

    testApi = async (req, res) => {
        try {
            const { userDetails: {userId,
                profileId,
                profileData,
                userData = {},
                userCategoryData = {}} = {}} = req;

            return this.raiseSuccess(res, 200, {
                profileId, profileData,
                userId, userData, userCategoryData
            }, "Test api successfull.");
        } catch (error) {
            Log.debug("testApi 500 error", error);
            return this.raiseServerError(res, 500, {}, "Error in test api.");
        }
    }
}

export default new AdhocController();
