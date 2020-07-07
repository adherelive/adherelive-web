import Controller from "../../";
import userService from "../../../services/user/user.service";
import patientService from "../../../services/patients/patients.service";
import minioService from "../../../services/minio/minio.service";

import PatientWrapper from "../../../ApiWrapper/mobile/patient";

import { randomString } from "../../../../libs/helper";
import Log from "../../../../libs/log";

import fs from "fs";
import md5 from "js-md5";
import { imgSync } from "base64-img";
import appointmentService from "../../../services/appointment/appointment.service";
import MAppointmentWrapper from "../../../ApiWrapper/mobile/appointments";

const Logger  = new Log("mobile patient controller");

class MPatientController extends Controller {
  constructor() {
    super();
  }

  mUpdatePatient = async (req, res) => {
    try {
      console.log("-------------- req.body ------------", req.body);
      const { userDetails, body } = req;
      const { pid, profile_pic, name, email } = body || {};
      const { userId = "3" } = userDetails || {};

      if (email) {
        const updateUserDetails = await userService.updateEmail(email, userId);
      }

      const patientDetails = await patientService.getPatientByUserId(userId);

      const splitName = name.split(" ");

      let profilePic = "";

      if (profile_pic.startsWith("data")) {
        const extension = profile_pic.substring(
          "data:image/".length,
          profile_pic.indexOf(";base64")
        );

        if (!extension) {
          return this.raiseClientError(
            res,
            422,
            { message: "Bad request" },
            ""
          );
        }

        const file_name = randomString(7);

        const file_path = imgSync(profile_pic, "/tmp", file_name);
        const file = fs.readFileSync(file_path);

        console.log("file ------> ", file);

        if (userId) {
          if (profile_pic) {
            await minioService.createBucket();

            let hash = md5.create();

            hash.update(`${userId}`);
            hash.hex();
            hash = String(hash);

            const imageName = md5(`${userId}-profile-pic`);
            // const fileExt = "";
            const file_name =
              hash.substring(4) + "/" + imageName + "." + extension;
            // const fileUrl = "/" + file_name;

            await minioService.saveBufferObject(file, file_name);
            profilePic = file_name;
          }
        } else {
          // todo
        }
      } else {
        if (userId) {
          profilePic = profile_pic;
        } else {
          // todo
        }
      }

      // const profilePicUrl = `${process.config.minio.MINIO_S3_HOST}/${process.config.minio.MINIO_BUCKET_NAME}/${profilePic}`;
      const profilePicUrl = `${profilePic}`;

      // todo minio configure here

      const patientData = {
        user_id: userId,
        first_name: splitName[0],
        middle_name: splitName.length > 2 ? splitName[2] : null,
        last_name: splitName.length > 1 ? splitName[1] : null,
        details: {
          // todo: profile_pic
          profile_pic: profilePicUrl,
        },
        uid: pid,
      };

      const updatedpatientDetails = await patientService.updatePatient(patientDetails, patientData);

      const patientApiWrapper = await PatientWrapper(updatedpatientDetails);

      return this.raiseSuccess(
        res,
        200,
        {
          patients: {
            [patientApiWrapper.getPatientId()]: {
              ...patientApiWrapper.getBasicInfo(),
            },
          },
        },
        "patient details updated successfully"
      );
    } catch (error) {
      console.log("UPDATE PATIENT ERROR --> ", error);
      return this.raiseServerError(res, 500, error, error.message);
    }
  };

  getPatientAppointments = async (req, res) => {
    const {raiseServerError, raiseSuccess} = this;
    try {
      const { params: { id } = {}, userDetails: { userId } = {} } = req;

      const appointmentList = await appointmentService.getAppointmentForPatient(
          id
      );
      // Logger.debug("appointmentList", appointmentList);

      // if (appointmentList.length > 0) {
      let appointmentApiData = {};
      let appointment_ids = [];

      for(const appointment of appointmentList) {
        const appointmentWrapper = await MAppointmentWrapper(appointment);
        appointmentApiData[
            appointmentWrapper.getAppointmentId()
            ] = appointmentWrapper.getBasicInfo();
        appointment_ids.push(appointmentWrapper.getAppointmentId());
      }

      return raiseSuccess(
          res,
          200,
          {
            appointments: {
              ...appointmentApiData,
            },
            appointment_ids
          },
          `appointment data for patient: ${id} fetched successfully`
      );
    } catch(error) {
      Logger.debug("getPatientAppointments 500 error", error);
      raiseServerError(res);
    }
  };
}

export default new MPatientController();
