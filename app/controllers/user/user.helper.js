// Services
import doctorService from "../../services/doctors/doctors.service";
import qualificationService from "../../services/doctorQualifications/doctorQualification.service";
import documentService from "../../services/uploadDocuments/uploadDocuments.service";
import userService from "../../services/user/user.service";
import userPreferenceService from "../../services/userPreferences/userPreference.service";
import UserVerificationServices from "../../services/userVerifications/userVerifications.services";
import userRolesService from "../../services/userRoles/userRoles.service";

import UserRolesWrapper from "../../apiWrapper/web/userRoles";

import awsS3Service from "../../services/awsS3/awsS3.service";
import md5 from "js-md5";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { EVENTS, Proxy_Sdk } from "../../proxySdk";
import {
  DOCUMENT_PARENT_TYPE,
  EMAIL_TEMPLATE_NAME,
  NO_ACTION,
  NO_APPOINTMENT,
  NO_MEDICATION,
  USER_CATEGORY,
  VERIFICATION_TYPE,
} from "../../../constant";
import { completePath } from "../../helper/s3FilePath";
import { createLogger } from "../../../libs/logger";

const chalk = require("chalk");

const logger = createLogger("WEB > USER > CONTROLLER");

export const doctorQualificationData = async (userId) => {
  try {
    let speciality = "";
    let gender = "";
    let registration_number = "";
    let registration_council = "";
    let registration_year = "";
    let qualification_details = [];

    let doctor = await doctorService.getDoctorByUserId(userId);

    if (doctor) {
      let docInfo = doctor.getBasicInfo;
      const {
        speciality: docSpeciality = "",
        gender: docGender = "",
        registration_number: docRegistrationNumber = "",
        registration_council: docRegistrationCouncil = "",
        registration_year: docRegistrationYear = "",
      } = docInfo || {};
      speciality = docSpeciality;
      gender = docGender;
      registration_number = docRegistrationNumber;
      registration_council = docRegistrationCouncil;
      registration_year = docRegistrationYear;

      let docId = doctor.get("id");

      let docQualifications =
        await qualificationService.getQualificationsByDoctorId(docId);

      for (let qualification of docQualifications) {
        let qualificationData = {};
        let qualificationId = qualification.get("id");
        qualificationData.degree = qualification.get("degree");
        qualificationData.college = qualification.get("college");
        qualificationData.year = qualification.get("year");
        qualificationData.id = qualificationId;

        let photos = [];

        let documents = await documentService.getDoctorQualificationDocuments(
          DOCUMENT_PARENT_TYPE.DOCTOR_QUALIFICATION,
          qualificationId
        );

        for (let document of documents) {
          photos.push(completePath(document.get("document")));
        }

        qualificationData.photos = photos;

        qualification_details.push(qualificationData);
      }
    }

    const qualificationData = {
      speciality,
      gender,
      registration_year,
      registration_number,
      registration_council,
      qualification_details,
    };
    return qualificationData;
  } catch (error) {
    logger.error(" GET DOCTOR QUALIFICATION CATCH ERROR ", error);
  }
};

export const uploadImageS3 = async (userId, file, folder = "other") => {
  try {
    const fileExt = file.originalname.replace(/\s+/g, "");
    await awsS3Service.createBucket();
    // const fileStream = fs.createReadStream(req.file);

    const imageName = md5(`${file.originalname}-${userId}`);
    // const fileExt = "";

    let hash = md5.create();

    // hash.update(userId);

    hash.hex();
    hash = String(hash);

    // const file_name = hash.substring(4) + "_Education_"+fileExt;
    const file_name = `${folder}/${userId}/${hash.substring(
      4
    )}/${imageName}/${fileExt}`;

    //   const metaData = {
    //     "Content-Type":
    //         "application/	application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    // };
    const fileUrl = "/" + file_name;
    await awsS3Service.saveBufferObject(file.buffer, file_name, {
      "Content-Type": file.mimetype,
    });

    /**
     * TODO: Need to check if we need to return the file url or not.
    logger.debug("file URL: ", process.config.minio.MINI);
    const file_link =
      process.config.s3.AWS_S3_HOST +
      "/" +
      process.config.s3.BUCKET_NAME +
      fileUrl;
     */
    let files = [completePath(fileUrl)];

    return files;
  } catch (error) {
    logger.error(" UPLOAD  CATCH ERROR ", error);
  }
};

export const checkUserCanRegister = async (email, creatorId = null) => {
  // creator id will come when doctor is being added by provider. In this provider id will come in that case.
  try {
    const userExits = await userService.getUserByEmail({ email });

    if (!userExits) {
      return true;
    }

    let canRegister = false;
    const existingUserCategory = userExits.get("category");
    if (
      existingUserCategory === USER_CATEGORY.DOCTOR ||
      existingUserCategory === USER_CATEGORY.HSP
    ) {
      const existingUserRole = await userRolesService.getAllByData({
        user_identity: userExits.get("id"),
      });

      if (existingUserRole && existingUserRole.length) {
        for (let i = 0; i < existingUserRole.length; i++) {
          const existingRoleWrapper = await UserRolesWrapper(
            existingUserRole[i]
          );
          if (
            (creatorId && creatorId === existingRoleWrapper.getLinkedId()) ||
            (!creatorId && !existingRoleWrapper.getLinkedId())
          ) {
            // If provider is adding then there should not be same email registered with same doctor.
            // else if there is self registration then there should not be another self account with same email.
            canRegister = false;
            break;
          } else {
            canRegister = true;
          }
        }
      }
    }
    return canRegister;
  } catch (err) {
    return false;
  }
};

export const createNewUser = async (
  email,
  password = null,
  creatorId = null,
  category = USER_CATEGORY.DOCTOR
) => {
  try {
    const userExists = await userService.getUserByEmail({ email });
    const canRegister = await checkUserCanRegister(email, creatorId);

    if (!canRegister) {
      const userExistsError = new Error();
      userExistsError.code = 11000;
      throw userExistsError;
    }

    let hash = null;
    if (password) {
      const salt = await bcrypt.genSalt(Number(process.config.saltRounds));
      hash = await bcrypt.hash(password, salt);
    }
    const link = uuidv4();
    if (!userExists) {
      const user = await userService.addUser({
        email,
        password: hash,
        sign_in_type: "basic",
        category: category ? category : USER_CATEGORY.DOCTOR,
        onboarded: false,
        // system_generated_password
      });
    } else if (!userExists.get("password") && password) {
      /* this check if for doctors(added via providers) logging in for 1st time */
      const updatedUser = await userService.updateUser(
        {
          password: hash,
        },
        userExits.get("id")
      );
    }

    const userInfo = await userService.getUserByEmail({ email });
    let userRoleId = null;

    const userRole = await userRolesService.create({
      user_identity: userInfo.get("id"),
      linked_id: creatorId ? creatorId : null,
      linked_with: creatorId ? USER_CATEGORY.PROVIDER : null,
    });

    if (userRole) {
      const userRoleWrapper = await UserRolesWrapper(userRole);
      userRoleId = userRoleWrapper.getId();
      await userPreferenceService.addUserPreference({
        user_id: userInfo.get("id"),
        details: {
          charts:
            // category === USER_CATEGORY.DOCTOR
            // ?
            [NO_MEDICATION, NO_APPOINTMENT, NO_ACTION],
          // :
          // [NO_APPOINTMENT , NO_ACTION]
        },
        user_role_id: userRoleId,
      });
    }

    await UserVerificationServices.addRequest({
      user_id: userInfo.get("id"),
      request_id: link,
      status: "pending",
      type: VERIFICATION_TYPE.SIGN_UP,
    });
    let uId = userInfo.get("id");

    const emailPayload = {
      title: "Verification mail",
      toAddress: email,
      templateName: EMAIL_TEMPLATE_NAME.WELCOME,
      templateData: {
        title: "Doctor",
        link: process.config.WEB_URL + process.config.app.invite_link + link,
        inviteCard: "",
        mainBodyText: "We are really happy that you chose us.",
        subBodyText: "Please verify your account",
        buttonText: "Verify",
        host: process.config.WEB_URL,
        contactTo: "customersupport@adhere.live",
      },
    };

    Proxy_Sdk.execute(EVENTS.SEND_EMAIL, emailPayload);
    return uId;
  } catch (error) {
    throw error;
  }
};

export const downloadFileFromS3 = async (objectName, filePath) => {
  try {
    await awsS3Service.createBucket();
    const response = await awsS3Service.downloadFileObject(
      objectName,
      filePath
    );

    return true;
  } catch (err) {
    logger.error("Error got in downloading file from s3: ", err);
    return false;
  }
};
