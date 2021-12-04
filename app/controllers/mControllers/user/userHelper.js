import doctorService from "../../../services/doctors/doctors.service";
import qualificationService from "../../../services/doctorQualifications/doctorQualification.service";
import clinicService from "../../../services/doctorClinics/doctorClinics.service";
import documentService from "../../../services/uploadDocuments/uploadDocuments.service";

import minioService from "../../../../app/services/minio/minio.service";
import md5 from "js-md5";
import UserVerifications from "../../../models/userVerifications";
import {
  EMAIL_TEMPLATE_NAME,
  USER_CATEGORY,
  DOCUMENT_PARENT_TYPE,
  ONBOARDING_STATUS,
} from "../../../../constant";
import {completePath} from "../../../helper/filePath";

export const doctorQualificationData = async (userId) => {
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
      qualification_details,
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
    
    const folder = "adhere";
    // const file_name = hash.substring(4) + "/" + imageName + "/" + fileExt;
    const file_name = `${folder}/${hash.substring(4)}/${imageName}/${fileExt}`;
    
    const metaData = {
      "Content-Type":
        "application/	application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    };
    
    console.log("816575641 ---------------> ", file_name);
    
    // const file_link =
    //   process.config.minio.MINIO_S3_HOST +
    //   "/" +
    //   process.config.minio.MINIO_BUCKET_NAME +
    //   "/" +
    //   file_name;
    
    // const fileUrl = `${folder}/${file_name}`;
    const fileUrl = "/" + file_name;
    await minioService.saveBufferObject(file.buffer, file_name, metaData);
    
    // console.log("file urlll: ", process.config.minio.MINI);
    let files = [completePath(fileUrl)];
    return files;
  } catch (error) {
    console.log(" UPLOAD  CATCH ERROR ", error);
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

export const getServerSpecificConstants = () => {
  const server_constants = {
    GETSTREAM_API_KEY: process.config.getstream.key,
    GETSTREAM_APP_ID: process.config.getstream.appId,
    
    TWILIO_CHANNEL_SERVER: process.config.twilio.CHANNEL_SERVER,
    
    AGORA_APP_ID: process.config.agora.app_id,
    
    RAZORPAY_KEY: process.config.razorpay.key,
    
    ALGOLIA_APP_ID: process.config.algolia.app_id,
    ALGOLIA_APP_KEY: process.config.algolia.app_key,
    ALGOLIA_MEDICINE_INDEX: process.config.algolia.medicine_index,
    ONE_SIGNAL_APP_ID: process.config.one_signal.app_id,
  };
  
  return server_constants;
};
