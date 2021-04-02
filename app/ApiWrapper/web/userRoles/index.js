import BaseUserRole from "../../../services/userRoles";

// --- SERVICES
import userRoleService from "../../../services/userRoles/userRoles.service";
import providerService from "../../../services/provider/provider.service";
import doctorService from "../../../services/doctor/doctor.service";
import patientService from "../../../services/patients/patients.service";
import doctorProviderMappingService from "../../../services/doctorProviderMapping/doctorProviderMapping.service";

// --- WRAPPERS
import DoctorWrapper from "../../web/doctor";
import ProviderWrapper from "../../web/provider";
import DoctorProviderMappingWrapper from "../../web/doctorProviderMapping";
import PatientWrapper from "../../web/patient";


import { USER_CATEGORY} from "../../../../constant";


class UserRoleWrapper extends BaseUserRole {
    constructor(data) {
        super(data);
        console.log("USER ROLE WRAPPER DATA",data);
    }


    getBasicInfo = () => {

        const { _data } = this;
        const {
            id,
            user_id,
            category_id,
            category_type,
            createdAt:created_at,
            updatedAt:updated_at
        } = _data || {};


        
        return {
            basic_info: {
                id,
                user_id,
                category_id,
                category_type,
                created_at,
                updated_at
            }
            
        };
    };

    getAllInfo = async () => { 


        const {_data, getBasicInfo,getUserId} = this;


        const getUserRoleUserCategoryId = await this.getUserRoleCategoryId();
        const getUserRoleUserCategoryType = await this.getUserRoleCategoryType();

        let user_category_data = {};

        switch (getUserRoleUserCategoryType) {
            case USER_CATEGORY.PROVIDER:
                const providerData = await providerService.getProviderByData({id:getUserRoleUserCategoryId});
                const providerDataWrapper = await  ProviderWrapper(providerData);
                const providerAllInfo = await providerDataWrapper.getAllInfo();
                user_category_data = {...providerAllInfo,
                    user_category_id:getUserRoleUserCategoryId,
                    user_category_type:getUserRoleUserCategoryType
                }

                break;
            case USER_CATEGORY.DOCTOR:
                const doctorData = await doctorService.getDoctorByData({id:getUserRoleUserCategoryId});
                const DoctorDataWrapper  = await DoctorWrapper(doctorData);
                const doctorAllInfo = await DoctorDataWrapper.getAllInfo();
                user_category_data = {...doctorAllInfo,
                    user_category_id:getUserRoleUserCategoryId,
                    user_category_type:getUserRoleUserCategoryType
                }
                const doctor_id = getUserRoleUserCategoryId;
                const doctorProvider = await doctorProviderMappingService.getProviderForDoctor(
                    doctor_id
                  );


                  let providerId = null ;
                  if (doctorProvider) {

                    const doctorProviderWrapper = await DoctorProviderMappingWrapper(
                      doctorProvider
                    );
                    providerId = await doctorProviderWrapper.getProviderId();


                    const providerData = await ProviderWrapper(null, providerId);
                    const providerAllInfo =await  providerData.getAllInfo();

                    user_category_data = { ...user_category_data , 
                        provider_data : { ...providerAllInfo } };
                  }  

                break;    
            case USER_CATEGORY.PATIENT:
                const patientData = await patientService.getPatientByData({id:getUserRoleUserCategoryId});
                const patientDatawrapper = await PatientWrapper(patientData);
                const patietAllInfo = patientDatawrapper.getAllInfo();
                user_category_data = {...patietAllInfo,
                    user_category_id:getUserRoleUserCategoryId,
                    user_category_type:getUserRoleUserCategoryType
                }
                break;    
            case USER_CATEGORY.ADMIN:
                user_category_data = {};
                break;        
            default:
                break;
        }

        console.log("9837462534762379482793452346",{user_category_data});
        

        return {
            ...getBasicInfo(),
            user_category_data
        }
    };


}

export default async (data = null, id = null) => {
    if (data) {
        return new UserRoleWrapper(data);
    }
    const userRole = await userRoleService.getUserRoleById( id );
    return new UserRoleWrapper(userRole);
}