import Controller from "../index";
import Logger from "../../../libs/log";
import jwt from "jsonwebtoken";
import base64 from "js-base64";

// SERVICES --------------------------------
import userRoleService from "../../services/userRoles/userRoles.service";
import userService from "../../services/user/user.service";

//WRAPPERS
import UserRoleWrapper from "../../ApiWrapper/web/userRoles";
import UserWrapper from "../../ApiWrapper/web/user";

import { USER_CATEGORY } from "../../../constant";
import AppNotification from "../../NotificationSdk/inApp";
import { getTime } from "../../../app/helper/timer";

const Log = new Logger("WEB > CONTROLLER > PAYMENTS");

class UserRoleController extends Controller {
  constructor() {
    super();
  }

  getUserRolesNew = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      const { userDetails: { userId = null } = {} } = req;

      if (!userId) {
        return raiseClientError(res, 422, {}, "UNAUTHORIZED");
      }

      const userRoles =
        (await userRoleService.getAllByData({ user_identity: userId })) || [];
      // let userRoleApiData = {};
      let user_role_ids = [];
      let doctors = {};
      let patients = {};
      let providers = {};
      let admins = {};
      let user_roles = {};

      for (let i = 0; i < userRoles.length; i++) {
        const userRole = userRoles[i];
        const userRoleWrapper = await UserRoleWrapper(userRole);
        const userRoleAllInfo = await userRoleWrapper.getAllInfoNew();
        const userRoleId = userRoleWrapper.getId();
        user_role_ids.push(userRoleId);

        const { user_roles: userRoleData = {} } = userRoleAllInfo || {};

        user_roles = { ...user_roles, ...userRoleData };
      }

      return raiseSuccess(
        res,
        200,
        {
          // users: { [userId]: userData },
          // users: {},
          user_roles,
          user_role_ids,
          // doctors,
          // providers,
          // providers: {},
          // patients,
          // admins,
        },
        "User role data fetched successfully"
      );
    } catch (error) {
      Log.debug("get UserRole Data 500 error", error);
      return raiseServerError(res);
    }
  };

  getUserRoles = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      const { userDetails: { userId = null } = {} } = req;

      if (!userId) {
        return raiseClientError(res, 422, {}, "UNAUTHORIZED");
      }

      const userRoles =
        (await userRoleService.getAllByData({ user_identity: userId })) || [];
      // let userRoleApiData = {};
      let user_role_ids = [];
      let doctors = {};
      let patients = {};
      let providers = {};
      let admins = {};
      let user_roles = {};

      for (let i = 0; i < userRoles.length; i++) {
        const userRole = userRoles[i];
        const userRoleWrapper = await UserRoleWrapper(userRole);
        const userRoleAllInfo = await userRoleWrapper.getAllInfo();
        const userRoleId = userRoleWrapper.getId();
        user_role_ids.push(userRoleId);

        const {
          doctors: userRoleDoctors = {},
          providers: userRoleProviders = {},
          admins: userRoleAdmins = {},
          patients: userRolePatients = {},
          user_roles: userRoleData = {},
        } = userRoleAllInfo || {};

        if (userRoleDoctors && Object.keys(userRoleDoctors).length) {
          for (let i in userRoleDoctors) {
            const each = userRoleDoctors[i] || {};
            const { watchlist_ids = [] } = each;
          }
        }

        doctors = { ...doctors, ...userRoleDoctors };
        providers = { ...providers, ...userRoleProviders };
        admins = { ...admins, ...userRoleAdmins };
        patients = { ...patients, ...userRolePatients };
        user_roles = { ...user_roles, ...userRoleData };
      }

      const user = await userService.getUserById(userId);
      const userDataWrapper = await UserWrapper(user);
      const userData = userDataWrapper.getBasicInfo();
      return raiseSuccess(
        res,
        200,
        {
          users: { [userId]: userData },
          // users: {},
          user_roles,
          user_role_ids,
          doctors,
          providers,
          patients,
          admins,
        },
        "User role data fetched successfully"
      );
    } catch (error) {
      Log.debug("get UserRole Data 500 error", error);
      return raiseServerError(res);
    }
  };

  switchRoleId = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      const { userDetails: { userId } = {}, body: { userRoleId = null } = {} } =
        req;

      const { count, rows } =
        (await userRoleService.findAndCountAll({
          where: {
            user_identity: userId,
          },
          attributes: ["id"],
        })) || [];

      const allRoleIds = rows.map((row) => row.id);

      if (allRoleIds.indexOf(parseInt(userRoleId)) === -1) {
        return raiseClientError(res, 422, {}, "UNAUTHORIZED");
      }

      const expiresIn = process.config.TOKEN_EXPIRE_TIME; // expires in 30 day

      const user = await userService.getUserById(userId);

      if (!user) {
        return raiseClientError(res, 422, {}, "User doesn't exists");
      }

      const secret = process.config.TOKEN_SECRET_KEY;
      const accessToken = await jwt.sign(
        {
          userRoleId,
        },
        secret,
        {
          expiresIn,
        }
      );

      const appNotification = new AppNotification();

      const notificationToken = appNotification.getUserToken(`${userRoleId}`);
      const feedId = base64.encode(`${userRoleId}`);

      const userRef = await userService.getUserData({ id: user.get("id") });

      const apiUserDetails = await UserWrapper(userRef.get());

      // let permissions = {
      //   permissions: [],
      // };

      // if (apiUserDetails.isActivated()) {
      //   permissions = await apiUserDetails.getPermissions();
      // }

      const dataToSend = {
        ...(await apiUserDetails.getReferenceData()),
        auth_user: apiUserDetails.getId(),
        auth_user_role: userRoleId,
        notificationToken: notificationToken,
        feedId,
        auth_category: apiUserDetails.getCategory(),
        hasConsent: apiUserDetails.getConsent(),
      };

      res.clearCookie("accessToken");

      res.cookie("accessToken", accessToken, {
        expires: new Date(
          Date.now() + process.config.INVITE_EXPIRE_TIME * 86400000
        ),
        httpOnly: true,
      });

      return raiseSuccess(
        res,
        200,
        { ...dataToSend },
        "User data for RoleId retrieved successfully"
      );
    } catch (error) {
      Log.debug("switchRoleId data 500 error ----> ", error);

      // notification
      // const crashJob = await AdhocJob.execute("crash", {
      //   apiName: "switchRoleId",
      // });
      // Proxy_Sdk.execute(EVENTS.SEND_EMAIL, crashJob.getEmailTemplate());

      return raiseServerError(res);
    }
  };
}

export default new UserRoleController();
