import Controller from "../index";
import Logger from "../../../libs/log";
import jwt from "jsonwebtoken";

// SERVICES --------------------------------
import userRoleService from "../../../app/services/userRoles/userRoles.service";
import userService from "../../../app/services/user/user.service";

//WRAPPERS
import UserRoleWrapper from "../../ApiWrapper/web/userRoles";
import UserWrapper from "../../ApiWrapper/web/user";

import { USER_CATEGORY} from "../../../constant";


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

              // console.log("8768236487236487236487326472364732",{decodedAccessToken});

              const userRoles = await userRoleService.getUserRolesByUserId(userId);
              let userRoleApiData = {};
              let userData = {};
              let user_role_ids = [];
              let doctors = {};
              let patients = {};
              let providers = {};
              let admins = {};



              for(let i=0;i<userRoles.length;i++){

                const each = userRoles[i];
                const userRoleWrapper = await UserRoleWrapper(each);
                const userRoleAllInfo = await userRoleWrapper.getAllInfo();
                const userRoleId = await userRoleWrapper.getUserRoleId();
                userRoleApiData[userRoleId] = await userRoleWrapper.getBasicInfo();
                user_role_ids.push(userRoleId);

                const {
                    doctors : userRoleDoctors = {} ,
                    providers : userRoleProviders ={} , 
                    admins :userRoleAdmins = {} , 
                    patients : userRolePatients = {}
                  } = userRoleAllInfo || {};

                doctors = { ...doctors, ...userRoleDoctors };
                providers = { ...providers , ...userRoleProviders };
                admins = {...admins , ...userRoleAdmins };
                patients = { ...patients , ...userRolePatients };

              }



              if(userRoles.length){
                const firstUserRole = userRoles[0];
                const userRoleWrapper = await UserRoleWrapper(firstUserRole);
                const userId = await userRoleWrapper.getUserId();
                const user = await userService.getUserById(userId);
                const userDataWrapper = await UserWrapper(user);
                userData = await userDataWrapper.getBasicInfo();

              }


              
                return raiseSuccess(
                res,
                200,
                {
                  user_roles:{...userRoleApiData},
                  userId,
                  users:{ [userId] : {...userData} },
                  user_role_ids,
                  doctors,
                  providers,
                  patients,
                  admins
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