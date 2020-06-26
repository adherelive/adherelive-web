import Controller from "../";
import userService from "../../../app/services/user/user.service";
import patientService from "../../../app/services/patients/patients.service";
import minioService from "../../../app/services/minio/minio.service";
import carePlanService from "../../services/carePlan/carePlan.service";
import carePlanMedicationService from "../../services/carePlanMedication/carePlanMedication.service";
import carePlanAppointmentService from "../../services/carePlanAppointment/carePlanAppointment.service";
import templateMedicationService from "../../services/templateMedication/templateMedication.service";
import templateAppointmentService from "../../services/templateAppointment/templateAppointment.service";
import medicineService from "../../services/medicine/medicine.service";
import CarePlanWrapper from "../../ApiWrapper/web/carePlan";

class PatientController extends Controller {
    constructor() {
        super();
    }

    updatePatient = async (req, res) => {
        try {
            const { userDetails, body, file } = req;
            const {
                pid,
                profile_pic,
                name,
                email
            } = body || {};
            const { userId = "3" } = userDetails || {};

            console.log("\n\n PROFILE PIC FILE \n", req);

            if (email) {
                const updateUserDetails = await userService.updateEmail(email, userId);
            }

            const splitName = name.split(' ');

            // todo minio configure here
            if (profile_pic) {
                await minioService.createBucket();
                // var file = path.join(__dirname, "../../../report.xlsx");
                const fileStream = fs.createReadStream(profile_pic);
                // console.log("FIleStreammmmmmmmmmmmmHHH",fileStream);
                let hash = md5.create();
                hash.update(userId);
                hash.hex();
                hash = String(hash);
                const folder = "patients";
                // const fileExt = "";
                const file_name = hash.substring(4) + "-Report." + fileExt;
                const metaData = {
                    "Content-Type":
                        "application/	application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                };
                const fileUrl = folder + "/" + file_name;
                await minioService.saveBufferObject(fileStream, fileUrl, metaData);

                console.log("file urlll: ", process.config.minio.MINI);
            }

            const patientData = {
                user_id: userId,
                first_name: splitName[0],
                middle_name: splitName.length > 2 ? splitName[2] : null,
                last_name: splitName.length > 1 ? splitName[1] : null,
                details: {
                    // todo: profile_pic
                },
                uid: pid
            };
            // add patient for userId
            const patientDetails = await patientService.updatePatientDetails(patientData);

            return this.raiseSuccess(res, 200, {
                patients: {
                    [patientDetails.getId]: {
                        ...patientDetails.getBasicInfo
                    }
                }
            }, "patient details updated successfully");

        } catch (error) {
            console.log("UPDATE PATIENT ERROR --> ", error);
            return this.raiseServerError(res, 500, error, error.getMessage());
        }
    };

    
}

export default new PatientController();