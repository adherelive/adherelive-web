import doctorService from "../../services/doctors/doctors.service";
import qualificationService from "../../services/doctorQualifications/doctorQualification.service";
import clinicService from "../../services/doctorClinics/doctorClinics.service";
import documentService from "../../services/uploadDocuments/uploadDocuments.service";
import userService from "../../services/user/user.service";
import userPreferenceService from "../../services/userPreferences/userPreference.service";
import UserVerificationServices from "../../services/userVerifications/userVerifications.services";
import userRolesService from "../../services/userRoles/userRoles.service";

import UserRolesWrapper from "../../ApiWrapper/web/userRoles";

// import  EVENTS from "../../proxySdk/proxyEvents";
import minioService from "../../../app/services/minio/minio.service";
import md5 from "js-md5";
const chalk = require("chalk");
import base64 from "js-base64";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import UserVerifications from "../../models/userVerifications";
import { Proxy_Sdk, EVENTS } from "../../proxySdk";
import {
  EMAIL_TEMPLATE_NAME,
  USER_CATEGORY,
  DOCUMENT_PARENT_TYPE,
  ONBOARDING_STATUS,
  VERIFICATION_TYPE
} from "../../../constant";
import {completePath} from "../../helper/filePath";

export const doctorQualificationData = async userId => {
  try {
    let speciality = "";
    let gender = "";
    let registration_number = "";
    let registration_council = "";
    let registration_year = "";
    let qualification_details = [];

    let doctor = await doctorService.getDoctorByUserId(userId);
    console.log(
      "GET PROFILE DATA USERRRRRRR",
      doctor.get("id"),
      doctor.getBasicInfo
    );

    if (doctor) {
      let docInfo = doctor.getBasicInfo;
      const {
        speciality: docSpeciality = "",
        gender: docGender = "",
        registration_number: docRegistrationNumber = "",
        registration_council: docRegistrationCouncil = "",
        registration_year: docRegistrationYear = ""
      } = docInfo || {};
      speciality = docSpeciality;
      gender = docGender;
      registration_number = docRegistrationNumber;
      registration_council = docRegistrationCouncil;
      registration_year = docRegistrationYear;

      let docId = doctor.get("id");

      let docQualifications = await qualificationService.getQualificationsByDoctorId(
        docId
      );

      for (let qualification of docQualifications) {
        console.log("QUALIFICATIONSSSSSSS=============>", qualification);
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
          photos.push(
              completePath(document.get("document"))
          );
        }

        qualificationData.photos = photos;
        console.log("DOCUMENTSSSSSSS=============>", qualificationData);
        qualification_details.push(qualificationData);
      }
    }

    const qualificationData = {
      speciality,
      gender,
      registration_year,
      registration_number,
      registration_council,
      qualification_details
    };
    return qualificationData;
  } catch (error) {
    console.log(" GET DOCTOR QUALIFICATION CATCH ERROR ", error);
  }
};

export const uploadImageS3 = async (userId, file, folder = "other") => {
  try {
    const fileExt = file.originalname.replace(/\s+/g, "");
    await minioService.createBucket();
    // const fileStream = fs.createReadStream(req.file);

    const imageName = md5(`${file.originalname}-${userId}`);
    // const fileExt = "";

    let hash = md5.create();

    // hash.update(userId);

    hash.hex();
    hash = String(hash);

    // const file_name = hash.substring(4) + "_Education_"+fileExt;
    const file_name = `${folder}/${userId}/${hash.substring(4)}/${imageName}/${fileExt}`;

    //   const metaData = {
    //     "Content-Type":
    //         "application/	application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    // };
    const fileUrl = "/" + file_name;
    await minioService.saveBufferObject(file.buffer, file_name, {"Content-Type": file.mimetype});

    // console.log("file urlll: ", process.config.minio.MINI);
    // const file_link =
    //   process.config.minio.MINIO_S3_HOST +
    //   "/" +
    //   process.config.minio.MINIO_BUCKET_NAME +
    //   fileUrl;
    let files = [completePath(fileUrl)];

    return files;
  } catch (error) {
    console.log(" UPLOAD  CATCH ERROR ", error);
  }
};

export const checkUserCanRegister = async(email, creatorId = null) => {
  // creator id will come when doctor is being added by provider. In this provider id will come in that case.
  try{
    const userExits = await userService.getUserByEmail({ email });

    if(!userExits) {
      return true;
    }

    let canRegister = false;
    const existingUserCategory = userExits.get("category");
    if(existingUserCategory === USER_CATEGORY.DOCTOR) {
      const existingUserRole = await userRolesService.getAllByData({user_identity: userExits.get("id")});

      if(existingUserRole && existingUserRole.length) {
        for(let i=0; i< existingUserRole.length; i++) {
          const existingRoleWrapper = await UserRolesWrapper(existingUserRole[i]);
          if((creatorId && creatorId === existingRoleWrapper.getLinkedId())|| (!creatorId && !existingRoleWrapper.getLinkedId())) {
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
  } catch(err) {
    return false;
  }
}

export const createNewUser = async (email, password = null, creatorId= null) => {
  try {
    const userExits = await userService.getUserByEmail({ email });
    const canRegister = await checkUserCanRegister(email, creatorId);

    if(!canRegister) {
      const userExitsError = new Error();
      userExitsError.code = 11000;
      throw userExitsError;
    }
    
    const link = uuidv4();

    if(!userExits) {
      let hash = null;
      if (password) {
        const salt = await bcrypt.genSalt(Number(process.config.saltRounds));
        hash = await bcrypt.hash(password, salt);
      }
  
      const user = await userService.addUser({
        email,
        password: hash,
        sign_in_type: "basic",
        category: "doctor",
        onboarded: false
        // system_generated_password
      });
  
      await userPreferenceService.addUserPreference({
        user_id: user.get("id"),
        details: {
          charts: ["1", "2", "3"]
        }
      });
    }
    

    const userInfo = await userService.getUserByEmail({ email });
    let userRoleId = null;

    const userRole = await userRolesService.create({
      user_identity:  userInfo.get("id"),
      linked_id: creatorId? creatorId: null,
      linked_with: creatorId? USER_CATEGORY.PROVIDER: null
    })

    if(userRole) {
      const userRoleWrapper = await UserRolesWrapper(userRole);
      userRoleId = userRoleWrapper.getId();
    }

    await UserVerificationServices.addRequest({
      user_id: userInfo.get("id"),
      request_id: link,
      status: "pending",
      type: VERIFICATION_TYPE.SIGN_UP
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
        contactTo: "patientEngagement@adhere.com"
      }
    };

    Proxy_Sdk.execute(EVENTS.SEND_EMAIL, emailPayload);
    return uId;
  } catch (error) {
    throw error;
  }
};

export const downloadFileFromS3 = async (objectName, filePath) => {
  try {
    await minioService.createBucket();
    const response = await minioService.downloadFileObject(
      objectName,
      filePath
    );
    console.log("Response got for the download is: ", response);
    return true;
  } catch (err) {
    console.log("Error got in downloading file from s3: ", err);
    return false;
  }
};