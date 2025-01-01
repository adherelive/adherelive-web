import Controller from "../index";

// services
import userService from "../../services/user/user.service";
import userRolesService from "../../services/userRoles/userRoles.service";
import carePanService from "../../services/carePlan/carePlan.service";
import userRoleService from "../../services/userRoles/userRoles.service";
import PaymentProductService from "../../services/paymentProducts/paymentProduct.service";
import watchlistService from "../../services/doctorPatientWatchlist/doctorPatientWatchlist.service";

// wrappers
import UserWrapper from "../../apiWrapper/web/user";
import CarePlanWrapper from "../../apiWrapper/web/carePlan";
import DoctorWrapper from "../../apiWrapper/web/doctor";
import UserRoleWrapper from "../../apiWrapper/web/userRoles";
import UserPreferenceWrapper from "../../apiWrapper/web/userPreference";
import PaymentProductsWrapper from "../../apiWrapper/web/paymentProducts";
import WatchlistWrapper from "../../apiWrapper/web/doctorPatientWatchlist";

import permissions from "../../../config/permissions";
import * as PermissionHelper from "../../helper/userCategoryPermisssions";
import { getLinkDetails, getUserDetails } from "./adhoc.helper";
import Logger from "../../../libs/log";
import carePlanService from "../../services/carePlan/carePlan.service";
import userPreferenceService from "../../services/userPreferences/userPreference.service";
import doctorPatientWatchlistService from "../../services/doctorPatientWatchlist/doctorPatientWatchlist.service";
import QueueService from "../../services/awsQueue/queue.service";
import patientsService from "../../services/patients/patients.service";
import { MID_MORNING, PATIENT_MEAL_TIMINGS } from "../../../constant";
import permissionService from "../../services/permission/permission.service";
import userPermissionService from "../../services/userPermission/userPermission.service";
import { USER_CATEGORY_ARRAY } from "../../models/users";

const Log = new Logger("WEB > ADHOC > CONTROLLER");

class AdhocController extends Controller {
  constructor() {
    super();
  }

  migrateAllUsersToUserRoles = async (req, res) => {
    try {
      const users = await userService.getAll();
      if (users && users.length) {
        for (let i = 0; i < users.length; i++) {
          const user = await UserWrapper(users[i]);
          const userId = user.getId();
          const category = user.getCategory();

          const linkData = await getLinkDetails(category, userId);

          const { linked_id = null, linked_with = null } = linkData || {};
          const userRole = await userRolesService.create({
            id: userId,
            user_identity: userId,
            linked_id,
            linked_with,
          });
        }
      }

      // -------- update careplans for user_role_id

      const careplans = await carePanService.getAll();
      if (careplans && careplans.length) {
        for (let i = 0; i < careplans.length; i++) {
          const careplan = await CarePlanWrapper(careplans[i]);
          const carePlanId = await careplan.getCarePlanId();
          const doctorId = careplan.getDoctorId();
          const doctor = await DoctorWrapper(null, doctorId);
          const userId = await doctor.getUserId();
          const userRole = await userRolesService.getFirstUserRole(userId);
          if (userRole) {
            const userRoleWrapper = await UserRoleWrapper(userRole);
            const userRoleId = userRoleWrapper.getId();
            let carePlanData = { ...careplan, user_role_id: userRoleId };
            const careplan = await carePlanService.updateCarePlan(
              carePlanData,
              carePlanId
            );
          }
        }
      }

      // user preferences

      const userPreferences = (await userPreferenceService.getAll()) || [];
      let userPreferenceArr = [];
      for (let index = 0; index < userPreferences.length; index++) {
        const userPreference = await UserPreferenceWrapper(
          userPreferences[index]
        );
        // get role id
        const userRole =
          (await userRoleService.findOne({
            where: {
              user_identity: userPreference.getUserId(),
            },
            attributes: ["id"],
          })) || null;
        userPreferenceArr.push({
          id: userPreference.getUserPreferenceId(),
          user_id: userPreference.getUserId(),
          user_role_id: userRole.id,
        });
      }

      const updateResponse = await userPreferenceService.bulkUpdate({
        data: userPreferenceArr,
      });

      //-- add test-provider record to user-pref table

      const user = await userService.getUserData({
        email: "test-provider@mail.com",
      });

      if (user) {
        const userWrapper = await UserWrapper(user);
        const user_identity = await userWrapper.getId();

        const existing = await userPreferenceService.findOne({
          where: { user_id: user_identity },
        });

        if (!existing) {
          const userRole = await userRoleService.getFirstUserRole(
            user_identity
          );

          if (userRole) {
            const userRoleData = await UserRoleWrapper(userRole);
            const userRoleId = userRoleData.getId();

            const newRecord = await userPreferenceService.addUserPreference({
              user_id: "5",
              details: {
                charts: ["1", "2", "3"],
              },
              user_role_id: userRoleId,
            });
          }
        }
      }

      // --- payment products migration

      const paymentProductService = new PaymentProductService();
      const paymentProducts = await paymentProductService.getAll();

      for (let index = 0; index < paymentProducts.length; index++) {
        const paymentProduct = await PaymentProductsWrapper(
          paymentProducts[index]
        );
        // categoryid --> user_id --> roleid

        const { user_id: forUserId } =
          (await getUserDetails(
            paymentProduct.getForUserType(),
            paymentProduct.getForUserRoleId()
          )) || {};

        let forUserRoleId = null;

        if (forUserId) {
          forUserRoleId =
            (await userRoleService.findOne({
              where: {
                user_identity: forUserId,
              },
              attributes: ["id"],
            })) || null;
        }

        const { user_id: creatorUserId } =
          (await getUserDetails(
            paymentProduct.getCreatorType(),
            paymentProduct.getCreatorRoleId()
          )) || {};

        let creatorRoleId = null;

        if (creatorUserId) {
          creatorRoleId =
            (await userRoleService.findOne({
              where: {
                user_identity: creatorUserId,
              },
              attributes: ["id"],
            })) || null;
        }

        if (forUserRoleId && creatorRoleId) {
          const { id: for_user_role_id = 0 } = forUserRoleId || {};
          const { id: creator_role_id = null } = creatorRoleId || {};

          const paymentProductUpdateResponse =
            await paymentProductService.updateDoctorProduct(
              {
                for_user_role_id,
                creator_role_id,
              },
              paymentProduct.getId()
            );
        }
      }

      // -- doctor patient watchlist

      const allWatchlistRecords = await watchlistService.getAll();
      if (allWatchlistRecords && allWatchlistRecords.length) {
        for (let i = 0; i < allWatchlistRecords.length; i++) {
          const watchlistWrapper = await WatchlistWrapper(
            allWatchlistRecords[i]
          );
          const recordId = await watchlistWrapper.getId();
          const doctor_id = await watchlistWrapper.getDoctorId();
          const doctorWrapper = await DoctorWrapper(null, doctor_id);
          const doctorUserId = await doctorWrapper.getUserId();
          const userRole = await userRoleService.getFirstUserRole(doctorUserId);
          if (userRole) {
            const userRoleWrapper = await UserRoleWrapper(userRole);
            const userRoleId = userRoleWrapper.getId();
            let recordData = { ...watchlistWrapper, user_role_id: userRoleId };
            const updatedRecord =
              await doctorPatientWatchlistService.updateRecord(
                recordData,
                recordId
              );
          }
        }
      }

      return this.raiseSuccess(
        res,
        200,
        {},
        "All users migrated successfully to user roles."
      );
    } catch (error) {
      Log.debug(
        "823746823764872634872364872 migrateAllUsersToUserRoles 50 error",
        error
      );
      return this.raiseServerError(
        res,
        500,
        {},
        "Error in migrating users data to user roles."
      );
    }
  };

  testApi = async (req, res) => {
    try {
      const {
        userDetails: {
          userId,
          userRoleId,
          userRoleData,
          userData = {},
          userCategoryData = {},
        } = {},
      } = req;

      return this.raiseSuccess(
        res,
        200,
        {
          userRoleId,
          userRoleData,
          userId,
          userData,
          userCategoryData,
        },
        "Test api successfull."
      );
    } catch (error) {
      Log.debug("testApi 500 error", error);
      return this.raiseServerError(res, 500, {}, "Error in test api.");
    }
  };

  purgeSqsQueue = async (req, res) => {
    try {
      const { body: { queue_name } = {} } = req;

      const queueService = new QueueService();
      const isDelete = await queueService.purgeQueue(queue_name);

      if (isDelete) {
        return this.raiseSuccess(res, 200, {}, "queue cleared successfully");
      } else {
        return this.raiseClientError(
          res,
          422,
          {},
          "Check queue name and try again"
        );
      }
    } catch (error) {
      Log.debug("purgeSqsQueue 500", error);
      return this.raiseServerError(res);
    }
  };

  updatePatientTimings = async (req, res) => {
    try {
      const allPatients = (await patientsService.getAll()) || [];

      if (allPatients.length > 0) {
        for (let index = 0; index < allPatients.length; index++) {
          const { user_id } = allPatients[index] || {};

          const patientPreference = await userPreferenceService.findOne({
            where: {
              user_id,
            },
          });

          const { id: preferenceId, details: { timings } = {} } =
            patientPreference || {};

          const { value } = PATIENT_MEAL_TIMINGS[MID_MORNING];

          const newTimings = { ...timings, [MID_MORNING]: { value } };

          await userPreferenceService.updateUserPreferenceData(
            {
              details: { timings: newTimings },
            },
            preferenceId
          );
        }

        return this.raiseSuccess(
          res,
          200,
          {},
          "All patient mid morning timings updated successfully"
        );
      } else {
        return this.raiseSuccess(
          res,
          201,
          {},
          "No patient present for the timing update"
        );
      }
    } catch (error) {
      Log.debug("updatePatientTimings 500", error);
      return this.raiseServerError(res);
    }
  };

  updatePermissions = async (req, res) => {
    const { raiseSuccess, raiseServerError } = this;
    try {
      let permissionsData = [];

      let userPermissionsData = [];

      for (const feature of Object.keys(permissions)) {
        const featurePermissions = permissions[feature];

        for (const permission of Object.keys(featurePermissions)) {
          permissionsData.push({
            type: featurePermissions[permission],
          });
        }
      }

      // delete previous user permissions
      const isPreviousUserPermissionsDeleted =
        await userPermissionService.deleteAll();

      // delete previous permissions
      if (isPreviousUserPermissionsDeleted) {
        const isPreviousPermissionDeleted = await permissionService.deleteAll();

        if (isPreviousPermissionDeleted) {
          // bulkCreate new permissions
          const createdPermissions =
            (await permissionService.bulkCreate(permissionsData)) || [];

          if (createdPermissions.length > 0) {
            for (const category of USER_CATEGORY_ARRAY) {
              const categoryPermissions =
                PermissionHelper.getPermissions(category) || [];

              Log.debug("102398123 updatePermissions", {
                category,
                categoryPermissions,
              });

              for (let createdPermission of createdPermissions) {
                const { id, type } = createdPermission || {};
                if (categoryPermissions.includes(type)) {
                  userPermissionsData.push({
                    category,
                    permission_id: id,
                  });
                }
              }
            }

            // bulkCreate new user permissions
            const createdUserPermissions =
              (await userPermissionService.bulkCreate(userPermissionsData)) ||
              [];

            if (createdUserPermissions.length > 0) {
              return raiseSuccess(
                res,
                200,
                {},
                "Permissions updated successfully"
              );
            }
          }
        }
      }
    } catch (error) {
      Log.debug("updatePermissions 500", error);
      return raiseServerError(res);
    }
  };

  updateChannels = async (req, res) => {
    const { raiseSuccess, raiseServerError } = this;
    try {
      const channelSeparator = process.config.twilio.CHANNEL_SERVER;

      const careplans = (await carePlanService.getAll()) || [];

      if (careplans.length) {
        for (let index = 0; index < careplans.length; index++) {
          const { id, patient_id, user_role_id } = careplans[index] || {};

          Log.debug(
            "1231023 ",
            `${user_role_id}-${channelSeparator}-${patient_id}`
          );
          await carePlanService.updateCarePlan(
            { channel_id: `${user_role_id}-${channelSeparator}-${patient_id}` },
            id
          );
        }

        return raiseSuccess(res, 200, {}, "Channels updated successfully");
      }
    } catch (error) {
      Log.debug("updateChannels 500", error);
      return raiseServerError(res);
    }
  };
}

export default new AdhocController();
