import Controller from "../../index";
import { createLogger } from "../../../../libs/logger";
import jwt from "jsonwebtoken";
import base64 from "js-base64";

import AppNotification from "../../../notificationSdk/inApp";

// Services
import userRoleService from "../../../services/userRoles/userRoles.service";
import userService from "../../../services/user/user.service";

// Wrappers
import UserRoleWrapper from "../../../apiWrapper/mobile/userRoles";
import UserWrapper from "../../../apiWrapper/mobile/user";

const logger = createLogger("MOBILE > CONTROLLER > USER_ROLES");

class UserRoleController extends Controller {
  constructor() {
    super();
  }

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
      logger.error("get UserRole Data 500 error", error);
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
        return raiseClientError(res, 422, user, "User doesn't exists");
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

      let permissions = [];

      if (apiUserDetails.isActivated()) {
        permissions = await apiUserDetails.getPermissions();
      }

      const dataToSend = {
        accessToken,
        notificationToken,
        feedId,
        users: {
          [apiUserDetails.getId()]: {
            ...apiUserDetails.getBasicInfo(),
          },
        },
        auth_user: apiUserDetails.getId(),
        auth_user_role: userRoleId,
        auth_category: apiUserDetails.getCategory(),
        hasConsent: apiUserDetails.getConsent(),
        permissions,
      };

      return raiseSuccess(
        res,
        200,
        { ...dataToSend },
        "Account switched successfully."
      );
    } catch (error) {
      logger.error("switchRoleId data 500 error ---> ", error);
      return raiseServerError(res);
    }
  };
}

export default new UserRoleController();
