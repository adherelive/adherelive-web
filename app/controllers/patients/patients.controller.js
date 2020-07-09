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
import carePlanTemplateService from "../../services/carePlanTemplate/carePlanTemplate.service";
import CarePlanTemplateWrapper from "../../ApiWrapper/web/carePlanTemplate";
import TemplateMedicationWrapper from "../../ApiWrapper/web/templateMedication";
import TemplateAppointmentWrapper from "../../ApiWrapper/web/templateAppointment";
import MedicineApiWrapper from "../../ApiWrapper/mobile/medicine";

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

            const medicineData = await medicineService.getMedicineByData({
                id: medicineId
            });

            let medicineApiData = {};

            for(const medicine of medicineData) {
                const medicineWrapper = await MedicineApiWrapper(medicine);
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

    getPatientCarePlanDetails = async (req, res) => {
        try {
            const { id: patient_id = 1 } = req.params;
            const { userDetails: {userId} = {} } = req;

            let show = false;

            let carePlan = await carePlanService.getSingleCarePlanByData({ patient_id });
            const carePlanData = await CarePlanWrapper(carePlan);

            let templateMedicationData = {};
            let template_medication_ids = [];

            let templateAppointmentData = {};
            let template_appointment_ids = [];
            let medicine_ids = [];


            let carePlanTemplateData = null;

            if(carePlanData.getCarePlanTemplateId()) {
                const carePlanTemplate = await carePlanTemplateService.getCarePlanTemplateById(carePlanData.getCarePlanTemplateId());
                carePlanTemplateData = await CarePlanTemplateWrapper(carePlanTemplate);
                const medications = await templateMedicationService.getMedicationsByCarePlanTemplateId(carePlanData.getCarePlanTemplateId());

                for(const medication of medications) {
                    const medicationData = await TemplateMedicationWrapper(medication);
                    templateMedicationData[medicationData.getTemplateMedicationId()] = medicationData.getBasicInfo();
                    template_medication_ids.push(medicationData.getTemplateMedicationId());
                    medicine_ids.push(medicationData.getTemplateMedicineId());
                }

                const appointments = await templateAppointmentService.getAppointmentsByCarePlanTemplateId(carePlanData.getCarePlanTemplateId());

                for(const appointment of appointments) {
                    const appointmentData = await TemplateAppointmentWrapper(appointment);
                    templateAppointmentData[appointmentData.getTemplateAppointmentId()] = appointmentData.getBasicInfo();
                    template_appointment_ids.push(appointmentData.getTemplateAppointmentId());
                }
            }

            let carePlanAppointmentData = {};
            let appointment_ids = [];

            let carePlanMedicationData = {};
            let medication_ids = [];

            const carePlanAppointments = await carePlanAppointmentService.getAppointmentsByCarePlanId(carePlanData.getCarePlanId());

            for(const carePlanAppointment of carePlanAppointments) {
                appointment_ids.push(carePlanAppointment.get("appointment_id"));
            }

            let appointmentApiDetails = {};
            const appointments = await appointmentService.getAppointmentByData({id: appointment_ids});
            for(const appointment of appointments) {
                const appointmentData = await AppointmentWrapper(appointment);
                appointmentApiDetails[appointmentData.getAppointmentId()] = appointmentData.getBasicInfo();
            }

            const carePlanMedications = await carePlanMedicationService.getMedicationsByCarePlanId(carePlanData.getCarePlanId());

            for(const carePlanMedication of carePlanMedications) {
                medication_ids.push(carePlanMedication.get("medication_id"));
            }

            let medicationApiDetails = {};
            const medications = await medicationReminderService.getMedicationsForParticipant({id: medication_ids});
            for(const medication of medications) {
                const medicationData = await MReminderWrapper(medication);
                medicationApiDetails[medicationData.getMReminderId()] = medicationData.getBasicInfo();
                medicine_ids.push(medicationData.getMedicineId());
            }

            Logger.debug(
                "medicineId",
                medicine_ids
            );

            const medicineData = await medicineService.getMedicineByData({
                id: medicine_ids
            });

            let medicineApiData = {};

            Logger.debug(
                "medicineData",
                medicineData
            );

            for(const medicine of medicineData) {
                const medicineWrapper = await MedicineApiWrapper(medicine);
                medicineApiData[medicineWrapper.getMedicineId()] = medicineWrapper.getBasicInfo();
            }

            // let cPdetails = carePlan.get('details')?carePlan.get('details'):{};
            //
            // let { shown = false } = cPdetails;
            // let carePlanId = carePlan.get('id');
            // let carePlanTemplateId = carePlan.get('care_plan_template_id');
            // // let carePlanMedications = await carePlanMedicationService.getMedicationsByCarePlanId(carePlanId);
            // // let carePlanAppointments = await carePlanAppointmentService.getAppointmentsByCarePlanId(carePlanId);
            //
            // let carePlanAppointmentIds = await getCarePlanAppointmentIds(carePlanId);
            // let carePlanMedicationIds = await getCarePlanMedicationIds(carePlanId);
            // let carePlanSeverityDetails = await getCarePlanSeverityDetails(carePlanId);
            // const carePlanApiWrapper = await CarePlanWrapper(carePlan);
            //
            // let carePlanApiData = {};
            //
            // carePlanApiData[
            //     carePlanApiWrapper.getCarePlanId()
            //     ] = { ...carePlanApiWrapper.getBasicInfo(), ...carePlanSeverityDetails, carePlanMedicationIds, carePlanAppointmentIds };
            //
            //
            //
            //
            // let formattedTemplateMedications = [];
            // let formattedTemplateAppointments = [];
            // if (carePlanTemplateId) {
            //   // templateMedications = await templateMedicationService.getMedicationsByCarePlanTemplateId(carePlanTemplateId);
            //   // templateAppointments = await templateAppointmentService.getAppointmentsByCarePlanTemplateId(carePlanTemplateId);
            //   if (templateMedications.length) {
            //     for (let medication of templateMedications) {
            //
            //       let newMedication = {};
            //       newMedication.id = medication.get('id');
            //       newMedication.schedule_data = medication.get('schedule_data');
            //       newMedication.care_plan_template_id = medication.get('care_plan_template_id');
            //       let medicineId = medication.get('medicine_id');
            //       newMedication.medicine_id = medicineId;
            //       let medicine = await medicineService.getMedicineById(medicineId);
            //       // console.log("CARE PLAN OF PATIENTTTT===========>>>>>>>", medicine);
            //       let medName = medicine.get('name');
            //       let medType = medicine.get('type');
            //       newMedication.medicine = medName;
            //       newMedication.medicineType = medType;
            //       formattedTemplateMedications.push(newMedication);
            //     }
            //   }
            //
            //   if (templateAppointments.length) {
            //     for (let appointment of templateAppointments) {
            //       let newAppointment = {};
            //       newAppointment.id = appointment.get('id');
            //       newAppointment.schedule_data = appointment.get('details');
            //       newAppointment.reason = appointment.get('reason');
            //       newAppointment.time_gap = appointment.get('time_gap');
            //       newAppointment.care_plan_template_id = appointment.get('care_plan_template_id');
            //       formattedTemplateAppointments.push(newAppointment);
            //     }
            //   }
            // }
            //
            // let medicationsOfTemplate = formattedTemplateMedications;
            // let appointmentsOfTemplate = formattedTemplateAppointments;
            //
            //
            // let carePlanMedicationsExists = carePlanMedications ? !carePlanMedications.length : !carePlanMedications; //true if doesnot exist
            // let carePlanAppointmentsExists = carePlanAppointments ? !carePlanAppointments.length : !carePlanAppointments; //true if doesnot exist
            // if (carePlanTemplateId && carePlanMedicationsExists && carePlanAppointmentsExists && !shown) {
            //   show = true;
            // }
            //
            //
            // console.log("CARE PLAN OF PATIENTTTT===========>>>>>>>", patient_id, carePlanId, shown
            //     , carePlanMedications, carePlanAppointments
            //     , show, carePlanTemplateId, carePlanMedicationsExists, carePlanAppointmentsExists);
            // if (shown == false) {
            //   let details = cPdetails;
            //   details.shown = true;
            //   let updatedCarePlan = await carePlanService.updateCarePlan({ details }, carePlanId);
            // }


            return this.raiseSuccess(res, 200, {
                // care_plans: { ...carePlanApiData },
                // show, medicationsOfTemplate, appointmentsOfTemplate, carePlanMedications, carePlanAppointments, carePlanTemplateId,
                care_plans: {
                    [carePlanData.getCarePlanId()]: {
                        ...carePlanData.getBasicInfo(),
                        appointment_ids,
                        medication_ids
                    }
                },
                care_plan_templates: {
                    [carePlanData.getCarePlanTemplateId()] : {
                        ...carePlanTemplateData ? carePlanTemplateData.getBasicInfo() : {},
                        template_appointment_ids,
                        template_medication_ids
                    }
                },
                appointments: {
                    ...appointmentApiDetails
                },
                medications: {
                    ...medicationApiDetails
                },
                template_appointments: {
                    ...templateAppointmentData
                },
                template_medications: {
                    ...templateMedicationData
                },
                medicines: {
                    ...medicineApiData
                }
            }, "Patient care plan details fetched successfully");

        } catch (error) {
            console.log("GET PATIENT DETAILS ERROR --> ", error);
            return this.raiseServerError(res);
        }
    };
}

export default new PatientController();