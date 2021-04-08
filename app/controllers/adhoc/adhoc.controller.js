
// services
import userService from "../../services/user/user.service";
import userRolesService from "../../services/userRoles/userRoles.service";
import carePanService from "../../services/carePlan/carePlan.service";
import userRoleService from "../../services/userRoles/userRoles.service";
import PaymentProductService from "../../services/paymentProducts/paymentProduct.service";

// wrappers
import UserWrapper from "../../ApiWrapper/web/user";
import CarePlanWrapper from "../../ApiWrapper/web/carePlan";
import DoctorWrapper from "../../ApiWrapper/web/doctor";
import UserRoleWrapper from "../../ApiWrapper/web/userRoles";
import UserPreferenceWrapper from "../../ApiWrapper/web/userPreference";
import PaymentProductsWrapper from "../../ApiWrapper/web/paymentProducts";

import { getLinkDetails, getUserDetails } from "./adhoc.helper";
import Controller from "../";
import Logger from "../../../libs/log";
import carePlanService from "../../services/carePlan/carePlan.service";
import userPreferenceService from "../../services/userPreferences/userPreference.service";

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

                    const linkData = await getLinkDetails(category, userId);

                    const { linked_id = null, linked_with = null} = linkData || {};
                    const userRole = await userRolesService.create({
                        id: userId,
                        user_identity: userId,
                        linked_id,
                        linked_with
                    });
                }
            }

            // -------- update careplans for user_role_id

            const careplans = await carePanService.getAll();
            if(careplans && careplans.length){
                for(let i=0; i< careplans.length; i++) {
                    const careplan = await CarePlanWrapper(careplans[i]);
                    const carePlanId = await careplan.getCarePlanId();
                    const doctorId = careplan.getDoctorId();
                    const doctor = await DoctorWrapper( null , doctorId );
                    const userId = await doctor.getUserId();
                    const userRole = await userRolesService.getFirstUserRole(userId);
                    if(userRole){
                        const userRoleWrapper = await UserRoleWrapper(userRole);
                        const userRoleId = userRoleWrapper.getId();
                        let carePlanData = { ...careplan , user_role_id: userRoleId };
                        const careplan = await carePlanService.updateCarePlan(carePlanData,carePlanId);
                    }
                }

            }

            // user preferences

            const userPreferences = await userPreferenceService.getAll() || [];
            let userPreferenceArr = [];
            for(let index = 0; index < userPreferences.length; index++) {
                const userPreference = await UserPreferenceWrapper(userPreferences[index]);
                // get role id
                const userRole = await userRoleService.findOne({
                    where: {
                        user_identity: userPreference.getUserId()
                    },
                    attributes: ["id"]
                }) || null;
                console.log("01823712 userRole", userRole);
                userPreferenceArr.push({
                    id:userPreference.getUserPreferenceId(),
                    user_id: userPreference.getUserId(),
                    user_role_id: userRole.id
                });
            }

            const updateResponse = await userPreferenceService.bulkUpdate({
                data: userPreferenceArr
            });

            Log.debug("0283193 userPreferences", updateResponse);

            // --- payment products migration

            const paymentProductService = new PaymentProductService();
            const paymentProducts = await paymentProductService.getAll();

            for(let index = 0; index < paymentProducts.length; index++) {
                const paymentProduct = await PaymentProductsWrapper(paymentProducts[index]);
                // categoryid --> user_id --> roleid

                const{ user_id: forUserId }= await getUserDetails(paymentProduct.getForUserType(), paymentProduct.getForUserRoleId()) || {};
                const forUserRoleId = await userRoleService.findOne({
                    where: {
                        user_identity: forUserId
                    },
                    attributes: ["id"]
                }) || null;

                const{ user_id: creatorUserId }= await getUserDetails(paymentProduct.getCreatorType(), paymentProduct.getCreatorRoleId()) || {};
                

                const creatorRoleId = await userRoleService.findOne({
                    where: {
                        user_identity: creatorUserId
                    },
                    attributes: ["id"]
                }) || null;

                const { id: for_user_role_id = 0} = forUserRoleId || {};
                const { id: creator_role_id = null } = creatorRoleId || {};

                const paymentProductUpdateResponse = await paymentProductService.updateDoctorProduct({
                    for_user_role_id,
                    creator_role_id
                }, paymentProduct.getId());
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
