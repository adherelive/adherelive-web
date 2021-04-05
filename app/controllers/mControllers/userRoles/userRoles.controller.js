import Controller from "../../index";
import Logger from "../../../../libs/log";
import jwt from "jsonwebtoken";
import base64 from "js-base64";

import AppNotification from "../../../NotificationSdk/inApp";

// SERVICES --------------------------------
import userRoleService from "../../../services/userRoles/userRoles.service";
import userService from "../../../services/user/user.service";

//WRAPPERS
import UserRoleWrapper from "../../../ApiWrapper/mobile/userRoles";
import UserWrapper from "../../../ApiWrapper/mobile/user";




const Log = new Logger("MOBILE > CONTROLLER > USER_ROLES");

class UserRoleController extends Controller {
    constructor() {
      super();
    }

    getUserRoles = async (req, res) => {
        const { raiseSuccess, raiseClientError, raiseServerError } = this;
        try {
            const {
                userDetails: {
                  userId = null
                } = {},
                body = {}
              } = req;

  
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
                  const userRoleId = await userRoleWrapper.getId();
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
                    users:{ [userId] : {...userData} },
                    user_role_ids,
                    doctors,
                    providers,
                    patients,
                    admins
                  },
                  "User role data fetched successfully"
                  );
              
         
        } catch (error) {
          Log.debug("get UserRole Data 500 error", error);
          return raiseServerError(res);
        }
      };


    switchRoleId = async(req, res) => {
      const { raiseSuccess, raiseClientError, raiseServerError } = this;
      try{
        const {
          userDetails  =  {},
          body : {userRoleId = null} = {}
        } = req;

        const userRoleWrapper  = await UserRoleWrapper(null,userRoleId);
        const userId = await userRoleWrapper.getUserId();
        const expiresIn = process.config.TOKEN_EXPIRE_TIME; // expires in 30 day
  
        const user = await userService.getUserById(userId);
  
        if (!user) {
          return raiseClientError(res, 422, user, "User doesn't exists");
        }
  
        const secret = process.config.TOKEN_SECRET_KEY;
        const accessToken = await jwt.sign(
          {
            userRoleId
          },
          secret,
          {
            expiresIn
          }
        );
  
        const appNotification = new AppNotification();
  
        const notificationToken = appNotification.getUserToken(
          `${userRoleId}`
        );
        const feedId = base64.encode(`${userRoleId}`);
  
        const userRef = await userService.getUserData({ id: user.get("id") });
        const apiUserDetails = await UserWrapper(userRef.get());
  
        let permissions = {
          permissions: []
        };
  
        if (apiUserDetails.isActivated()) {
          permissions = await apiUserDetails.getPermissions();
          Log.debug("675546767890876678", apiUserDetails.getBasicInfo());
        }
  
        const dataToSend = {
          accessToken,
          notificationToken,
          feedId,
          users: {
            [apiUserDetails.getId()]: {
              ...apiUserDetails.getBasicInfo()
            }
          },
          auth_user: apiUserDetails.getId(),
          auth_user_role: userRoleId,
          auth_category: apiUserDetails.getCategory(),
          hasConsent: apiUserDetails.getConsent(),
          ...permissions
        };
  
        return raiseSuccess(
          res,
          200,
          { ...dataToSend },
          "Account switched successfully."
        );
        
    
    } catch (error) {
      Log.debug("switchRoleId data 500 error ----> ", error);
      return raiseServerError(res);
    }
    };  

}

export default new UserRoleController();    