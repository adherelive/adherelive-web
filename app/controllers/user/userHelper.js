import doctorService from "../../services/doctors/doctors.service";
import qualificationService from "../../services/doctorQualifications/doctorQualification.service";
import clinicService from "../../services/doctorClinics/doctorClinics.service";
import documentService from "../../services/uploadDocuments/uploadDocuments.service";
import userService from "../../services/user/user.service";
import userPreferenceService from "../../services/userPreferences/userPreference.service";
import UserVerificationServices from "../../services/userVerifications/userVerifications.services";

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
            `${process.config.minio.MINIO_S3_HOST}/${
              process.config.minio.MINIO_BUCKET_NAME
            }${document.get("document")}`
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

export const uploadImageS3 = async (userId, file) => {
  try {
    const fileExt = file.originalname.replace(/\s+/g, "");
    await minioService.createBucket();
    // const fileStream = fs.createReadStream(req.file);

    const imageName = md5(`${userId}-qualification-pics`);
    // const fileExt = "";

    let hash = md5.create();

    // hash.update(userId);

    hash.hex();
    hash = String(hash);

    // const file_name = hash.substring(4) + "_Education_"+fileExt;
    const file_name = hash.substring(4) + "/" + imageName + "/" + fileExt;

    console.log(
      "----------------------------------------- imageName, fileExt ---> ",
      imageName,
      fileExt
    );

    //   const metaData = {
    //     "Content-Type":
    //         "application/	application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    // };
    const fileUrl = "/" + file_name;
    await minioService.saveBufferObject(file.buffer, file_name);

    // console.log("file urlll: ", process.config.minio.MINI);
    const file_link =
      process.config.minio.MINIO_S3_HOST +
      "/" +
      process.config.minio.MINIO_BUCKET_NAME +
      fileUrl;
    let files = [file_link];

    console.log("((((((((((((__________________________", file_link, fileUrl);
    return files;
  } catch (error) {
    console.log(" UPLOAD  CATCH ERROR ", error);
  }
};

export const createNewUser = async (email, password) => {
  try {
    const userExits = await userService.getUserByEmail({ email });

    console.log("CREDENTIALSSSSSSSSSSSSSS", password, email);
    if (userExits !== null) {
      const userExitsError = new Error();
      userExitsError.code = 11000;
      throw userExitsError;
    }

    let response;
    const link = uuidv4();
    const status = "pending";
    const salt = await bcrypt.genSalt(Number(process.config.saltRounds));
    const hash = await bcrypt.hash(password, salt);

    let user = await userService.addUser({
      email,
      password: hash,
      sign_in_type: "basic",
      category: "doctor",
      onboarded: false
    });

    const userPreference = await userPreferenceService.addUserPreference({
      user_id: user.get("id"),
      details: {
        charts: ["1", "2", "3"]
      }
    });

    const userInfo = await userService.getUserByEmail({ email });

    const userVerification = UserVerificationServices.addRequest({
      user_id: userInfo.get("id"),
      request_id: link,
      status: "pending",
      type: VERIFICATION_TYPE.SIGN_UP
    });
    let uId = userInfo.get("id");

    console.log(
      "CREDENTIALSSSSSSSSSSSSSS111111111111",
      "      1234567890          ",
      userInfo.get("id"),
      process.config.app.invite_link + link
    );
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
