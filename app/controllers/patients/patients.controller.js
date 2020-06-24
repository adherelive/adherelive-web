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

    getPatientCarePlanDetails = async (req, res) => {
        const { patientId: patient_id = 1 } = req.params;
        try {
            const { userDetails, body, file } = req;
            const {
                pid,
                profile_pic,
                name,
                email
            } = body || {};
            const { userId = "3" } = userDetails || {};

            let show = false;

            let carePlan = await carePlanService.getSingleCarePlanByData({ patient_id });
            let cPdetails =carePlan.get('details');
            let {shown=false}=cPdetails;
            let carePlanId = carePlan.get('id');
            let carePlanTemplateId = carePlan.get('care_plan_template_id');
            let carePlanMedications = await carePlanMedicationService.getMedicationsByCarePlanId(carePlanId);
            let carePlanAppointments = await carePlanAppointmentService.getAppointmentsByCarePlanId(carePlanId);
            let templateMedications = {};
            let templateAppointments = {};
            let formattedTemplateMedications = [];
            let formattedTemplateAppointments = [];
            if (carePlanTemplateId) {
                templateMedications = await templateMedicationService.getMedicationsByCarePlanTemplateId(carePlanTemplateId);
                templateAppointments = await templateAppointmentService.getAppointmentsByCarePlanTemplateId(carePlanTemplateId);
                if (templateMedications.length) {
                    for (let medication of templateMedications) {

                        let newMedication = {};
                        newMedication.id = medication.get('id');
                        newMedication.schedule_data = medication.get('schedule_data');
                        newMedication.care_plan_template_id = medication.get('care_plan_template_id');
                        let medicineId = medication.get('medicine_id');
                        newMedication.medicine_id = medicineId;
                        let medicine =await medicineService.getMedicineById(medicineId);
                        // console.log("CARE PLAN OF PATIENTTTT===========>>>>>>>", medicine);
                        let medName = medicine.get('name');
                        let medType = medicine.get('type');
                        newMedication.medicine = medName;
                        newMedication.medicineType = medType;
                        formattedTemplateMedications.push(newMedication);
                    }
                }

                if (templateAppointments.length) {
                    for (let appointment of templateAppointments) {
                        let newAppointment = {};
                        newAppointment.id = appointment.get('id');
                        newAppointment.schedule_data = appointment.get('details');
                        newAppointment.reason = appointment.get('reason');
                        newAppointment.time_gap = appointment.get('time_gap');
                        newAppointment.care_plan_template_id = appointment.get('care_plan_template_id');
                        formattedTemplateAppointments.push(newAppointment);
                    }
                }
            }

            let medicationsOfTemplate = formattedTemplateMedications;
            let appointmentsOfTemplate = formattedTemplateAppointments;


            let carePlanMedicationsExists = carePlanMedications ? !carePlanMedications.length : !carePlanMedications; //true if doesnot exist
            let carePlanAppointmentsExists = carePlanAppointments ? !carePlanAppointments.length : !carePlanAppointments; //true if doesnot exist
            if (carePlanTemplateId && carePlanMedicationsExists && carePlanAppointmentsExists && !shown) {
                show = true;
            }


            console.log("CARE PLAN OF PATIENTTTT===========>>>>>>>", patient_id,carePlanId,shown
            ,carePlanMedications,carePlanAppointments
            , show,carePlanTemplateId,carePlanMedicationsExists,carePlanAppointmentsExists);
            if(shown==false){
                let details=cPdetails;
                details.shown=true;
                let updatedCarePlan=await carePlanService.updateCarePlan({details},carePlanId);
            }


            return this.raiseSuccess(res, 200, {
                show, medicationsOfTemplate, appointmentsOfTemplate, carePlanMedications, carePlanAppointments,carePlanTemplateId
            }, "patient care plan details fetched successfully");

        } catch (error) {
            console.log("GET PATIENT DETAILS ERROR --> ", error);
            return this.raiseServerError(res, 500, error);
        }
    }
}

export default new PatientController();