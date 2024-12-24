import userService from "../../services/user/user.service";
import doctorService from "../../services/doctor/doctor.service";

import providerService from "../../services/provider/provider.service";
import doctorProviderMappingService from "../../services/doctorProviderMapping/doctorProviderMapping.service";

import UserWrapper from "../../apiWrapper/web/user";
import DoctorWrapper from "../../apiWrapper/web/doctor";
import ProviderWrapper from "../../apiWrapper/web/provider";

import { createNewUser } from "../user/userHelper";
import { generatePassword } from "../helper/passwordGenerator";

import { ONBOARDING_STATUS, USER_CATEGORY } from "../../../constant";
import { getFilePath } from "../../helper/filePath";

export const addProviderDoctor = async (
  req,
  res,
  raiseSuccess,
  raiseClientError
) => {
  try {
    const {
      userDetails: { userId, userData: { category: userCategory } = {} } = {},
    } = req;

    const {
      name,
      city,
      category,
      mobile_number,
      prefix,
      profile_pic,
      signature_pic,
      email,
      doctor_id = null,
    } = req.body;

    if (userCategory !== USER_CATEGORY.PROVIDER) {
      return raiseClientError(res, 401, {}, "UNAUTHORIZED");
    }

    const providerData = await providerService.getProviderByData({
      user_id: userId,
    });

    const provider = await ProviderWrapper(providerData);
    const providerId = provider.getProviderId();

    let prevDoctor = null,
      prevDoctorData = null;

    if (doctor_id) {
      prevDoctor = await doctorService.getDoctorByData({
        id: doctor_id,
      });

      if (!prevDoctor) {
        return raiseClientError(res, 422, {}, "Invalid doctor");
      }
      prevDoctorData = await DoctorWrapper(prevDoctor);
    }

    const doctorName = name.split(" ");

    const user_data_to_update = {
      category,
      mobile_number,
      prefix,
      onboarding_status: null,
    };

    // Mobile number validation
    const mobileNumberExist =
      (await userService.getUserByData({
        mobile_number,
      })) || [];

    if (mobileNumberExist && mobileNumberExist.length) {
      const prevUser = await UserWrapper(mobileNumberExist[0].get());
      const prevUserId = prevUser.getId();

      let doctorUserIdTemp = null;
      const doctorUserDetailsTemp = await userService.getUserByEmail({
        email,
      });

      if (doctorUserDetailsTemp) {
        const doctorUserWrapper = await UserWrapper(doctorUserDetailsTemp);
        doctorUserIdTemp = doctorUserWrapper.getId();
        if (prevUserId !== doctorUserIdTemp) {
          return raiseClientError(
            res,
            422,
            {},
            "This mobile number is already registered."
          );
        }
      } else {
        return raiseClientError(
          res,
          422,
          {},
          "This mobile number is already registered."
        );
      }
    }

    let doctorUserId = null;

    const doctorUserDetails = await userService.getUserByEmail({ email });
    if (doctorUserDetails && doctor_id) {
      const doctorUserWrapper = await UserWrapper(doctorUserDetails);
      doctorUserId = doctorUserWrapper.getId();

      if (prevDoctorData) {
        if (!doctor_id || doctorUserId !== prevDoctorData.getUserId()) {
          return raiseClientError(res, 422, {}, "Email already exists.");
        }
      }
    } else {
      // const password = generatePassword();
      doctorUserId = await createNewUser(email, null, providerId, category);
    }

    let doctor = {};
    let doctorExist = await doctorService.getDoctorByData({
      user_id: doctorUserId,
    });
    let first_name = doctorName[0];
    let middle_name = doctorName.length === 3 ? doctorName[1] : "";
    let last_name =
      doctorName.length === 3
        ? doctorName[2]
        : doctorName.length === 2
        ? doctorName[1]
        : "";

    if (doctorExist) {
      let doctor_data = {
        city,
        profile_pic: profile_pic ? getFilePath(profile_pic) : null,
        signature_pic: signature_pic ? getFilePath(signature_pic) : null,
        first_name,
        middle_name,
        last_name,
      };
      let doctor_id = doctorExist.get("id");
      doctor = await doctorService.updateDoctor(doctor_data, doctor_id);
    } else {
      let doctor_data = {
        user_id: doctorUserId,
        city,
        profile_pic: getFilePath(profile_pic),
        signature_pic: getFilePath(signature_pic),
        first_name,
        middle_name,
        last_name,
      };
      doctor = await doctorService.addDoctor(doctor_data);
    }
    const userUpdate = await userService.updateUser(
      user_data_to_update,
      doctorUserId
    );

    const updatedUser = await userService.getUserById(doctorUserId);

    const userData = await UserWrapper(updatedUser.get());

    const updatedDoctor = await doctorService.getDoctorByData({
      user_id: doctorUserId,
    });
    const doctorData = await DoctorWrapper(updatedDoctor);

    if (!doctorExist) {
      const doctorId = doctorData.getDoctorId();

      if (providerId) {
        const mappingData = { doctor_id: doctorId, provider_id: providerId };
        const response =
          await doctorProviderMappingService.createDoctorProviderMapping(
            mappingData
          );
      }
    }

    return raiseSuccess(
      res,
      200,
      {
        users: {
          [userData.getId()]: userData.getBasicInfo(),
        },
        doctors: {
          [doctorData.getDoctorId()]: doctorData.getBasicInfo(),
        },
      },
      "doctor profile updated successfully"
    );
  } catch (error) {
    throw error;
  }
};
