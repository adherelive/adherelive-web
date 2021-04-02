import Controller from "../index";
import Logger from "../../../libs/log";
import jwt from "jsonwebtoken";

// SERVICES --------------------------------
import userRoleService from "../../../app/services/userRoles/userRoles.service";
import userService from "../../../app/services/user/user.service";

//WRAPPERS
import UserRoleWrapper from "../../ApiWrapper/web/userRoles";
import UserWrapper from "../../ApiWrapper/web/user";

const Log = new Logger("WEB > CONTROLLER > PAYMENTS");

class UserRoleController extends Controller {
    constructor() {
      super();
    }

    getUserRoles = async (req, res) => {
        const { raiseSuccess, raiseClientError, raiseServerError } = this;
        try {
            const {
                userDetails: {
                  userCategoryId,
                  userData: { category = "" } = {}
                } = {},
                body = {}
              } = req;

              const { accessToken = '' } = body ;

              const secret = process.config.TOKEN_SECRET_KEY;
              const decodedAccessToken = await jwt.verify(accessToken, secret);
              const { userId = null } = decodedAccessToken || {};

              const userRoles = await userRoleService.getUserRolesByUserId(userId);
              let userRoleApiData = {};
              let userData = {};



              for(let i=0;i<userRoles.length;i++){
                const each = userRoles[i];
                const userRoleWrapper = await UserRoleWrapper(each);
                const userRoleAllInfo = await userRoleWrapper.getAllInfo();
                console.log("37472575264672368462346532478237492122",{userRoles,userRoleAllInfo});
                const userRoleId = await userRoleWrapper.getUserRoleId();
                userRoleApiData[userRoleId] =await userRoleWrapper.getAllInfo();
              }

              if(userRoles.length){
                const firstUserRole = userRoles[0];
                const userRoleWrapper = await UserRoleWrapper(firstUserRole);
                const userId = await userRoleWrapper.getUserId();
                const user = await userService.getUserById(userId);
                console.log("3728457325475247652472534",{user});
                const userDataWrapper = await UserWrapper(user);
                userData = await userDataWrapper.getBasicInfo();

              }

              
                return raiseSuccess(
                res,
                200,
                {
                  userRoles:{...userRoleApiData},
                  userId,
                  user_data:{ ...userData }
                },
                "UserRole data success"
                );
         
        } catch (error) {
          Log.debug("get UserRole Data 500 error", error);
          return raiseServerError(res);
        }
      };

}

export default new UserRoleController();    