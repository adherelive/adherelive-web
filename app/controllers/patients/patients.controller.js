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
import appointmentService from "../../services/appointment/appointment.service";
import AppointmentWrapper from "../../ApiWrapper/web/appointments";
import medicationReminderService from "../../services/medicationReminder/mReminder.service";
import MReminderWrapper from "../../ApiWrapper/web/medicationReminder";
import MedicineWrapper from "../../ApiWrapper/web/medicine";

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
            const patientDetails = await patientService.updatePatient(patientData);

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
                const appointmentWrapper = await AppointmentWrapper(appointment);
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

    getPatientMedications = async (req, res) => {
        const { raiseSuccess, raiseServerError } = this;
        try {
            const { params: { id } = {} } = req;

            const medicationDetails = await medicationReminderService.getMedicationsForParticipant(
                { participant_id: id }
            );

            // console.log("712367132 medicationDetails --> ", medicationDetails);
            // Logger.debug("medication details", medicationDetails);

            let medicationApiData = {};
            let medicineId = [];

            for(const medication of medicationDetails) {
                const medicationWrapper = await MReminderWrapper(medication);
                medicationApiData[
                    medicationWrapper.getMReminderId()
                    ] = medicationWrapper.getBasicInfo();
                medicineId.push(medicationWrapper.getMedicineId());
            }

            Logger.debug(
                "medicineId",
                medicationDetails
            );

            const medicineData = await medicineService.getMedicineById({
                id: medicineId
            });

            let medicineApiData = {};

            if(medicineData !== null) {
                const medicineWrapper = await MedicineWrapper(medicineData);
                medicineApiData[medicineWrapper.getMedicineId()] = medicineWrapper.getBasicInfo();
            }

            Logger.debug("medicineData", medicineData);

            return raiseSuccess(
                res,
                200,
                {
                    medications: {
                        ...medicationApiData
                    },
                    medicines: {
                        ...medicineApiData
                    }
                },
                "Medications fetched successfully"
            );
        } catch(error) {
            Logger.debug("500 error ", error);
            return raiseServerError(res);
        }
    };
}

export default new PatientController();