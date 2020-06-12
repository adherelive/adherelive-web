import Controller from "../../";
import userService from "../../../services/user/user.service";
import patientService from "../../../services/patients/patients.service";
import minioService from "../../../services/minio/minio.service";
import { randomString } from "../../../../libs/helper";
import { saveFileIntoUserBucket } from "../../helper/user";

import fs from "fs";
import md5 from "js-md5";
import { imgSync } from "base64-img";

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

      const profilePicUrl = `${process.config.minio.MINIO_S3_HOST}/${process.config.minio.MINIO_BUCKET_NAME}/${profilePic}`;

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

      return this.raiseSuccess(
        res,
        200,
        {
          patients: {
            [updatedpatientDetails.getId]: {
              ...updatedpatientDetails.getBasicInfo,
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
}

export default new MPatientController();
