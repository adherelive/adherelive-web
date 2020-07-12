import Controller from "../../index";
import userService from "../../../../app/services/user/user.service";
import patientService from "../../../../app/services/patients/patients.service";
import minioService from "../../../../app/services/minio/minio.service";
import carePlanService from "../../../services/carePlan/carePlan.service";
import carePlanTemplateService from "../../../services/carePlanTemplate/carePlanTemplate.service";
import CarePlanWrapper from "../../../ApiWrapper/mobile/carePlan";
import appointmentService from "../../../services/appointment/appointment.service";
import medicationReminderService from "../../../services/medicationReminder/mReminder.service";
import carePlanMedicationService from "../../../services/carePlanMedication/carePlanMedication.service";
import carePlanAppointmentService from "../../../services/carePlanAppointment/carePlanAppointment.service";
import templateMedicationService from "../../../services/templateMedication/templateMedication.service";
import templateAppointmentService from "../../../services/templateAppointment/templateAppointment.service";
import medicineService from "../../../services/medicine/medicine.service";
import { getCarePlanAppointmentIds, getCarePlanMedicationIds, getCarePlanSeverityDetails } from './carePlanHelper'
const moment = require("moment");

class CarePlanController extends Controller {
    constructor() {
        super();
    }


    createCarePlanMedicationsAndAppointmentsByTemplateData = async (req, res) => {
        const { carePlanId: care_plan_id = 1 } = req.params;
        try {
            const { medicationsData, appointmentsData } = req.body;


            const { userDetails } = req;
            const { userId, userData: { category } = {} } = userDetails || {};

            const id = parseInt(care_plan_id);

            const carePlan = await carePlanService.getCarePlanById(id);

            console.log("====================> ", care_plan_id, id, carePlan, userDetails);
            const patient_id = carePlan.get('patient_id');

            for (let appointment of appointmentsData) {
                let {
                    schedule_data: { description = '', end_time = '', organizer = {}, treatment = '', participant_two = {}, start_time = '', date = '' } = {},
                    reason = '', time_gap = '' } = appointment;

                    const getAppointmentForTimeSlot = await appointmentService.checkTimeSlot(
                        date,
                        start_time,
                        end_time
                      );

                      if (getAppointmentForTimeSlot.length > 0) {
                        return raiseClientError(
                          res,
                          422,
                          {
                            error_type: "slot_present",
                          },
                          `Appointment Slot already present between`
                        );
                      }
            };

            for (let appointment of appointmentsData) {
                let {
                    schedule_data: { description = '', end_time = '', organizer = {}, treatment = '', participant_two = {}, start_time = '', date = '' } = {},
                    reason = '', time_gap = '' } = appointment;


                console.log("AppointmentTTTTTTTTT=======>", care_plan_id, date, appointment);
                const { id: participant_two_id, category: participant_two_type } =
                    participant_two || {};

                const appointment_data = {
                    participant_one_type: category,
                    participant_one_id: userId,
                    participant_two_type,
                    participant_two_id,
                    organizer_type:
                        Object.keys(organizer).length > 0 ? organizer.category : category,
                    organizer_id: Object.keys(organizer).length > 0 ? organizer.id : userId,
                    description,
                    start_date: moment(date),
                    end_date: moment(date),
                    start_time,
                    end_time,
                    details: {
                        treatment,
                        reason
                    },
                };

                const baseAppointment = await appointmentService.addAppointment(
                    appointment_data
                );
                let data_to_create = {
                    care_plan_id,
                    appointment_id: baseAppointment.get('id')
                }

                let newAppointment = await carePlanAppointmentService.addCarePlanAppointment(data_to_create);

            }


            for (let medication of medicationsData) {
                let { schedule_data: { end_date = '', description = "", start_date = '', unit = '', when_to_take = '',
                    repeat = '', quantity = '', repeat_days = [], strength = '', start_time = '', repeat_interval = '', medication_stage = '' } = {},
                    medicine_id = '' } = medication;
                const dataToSave = {
                    participant_id: patient_id,
                    organizer_type: category,
                    organizer_id: userId,
                    description,
                    start_date,
                    end_date,
                    details: {
                        medicine_id,
                        start_time: start_time ? start_time : moment(),
                        end_time: start_time ? start_time : moment(),
                        repeat,
                        repeat_days,
                        repeat_interval,
                        quantity,
                        strength,
                        unit,
                        when_to_take,
                        medication_stage
                    }
                };

                const mReminderDetails = await medicationReminderService.addMReminder(
                    dataToSave
                );

                const data_to_create = {
                    care_plan_id,
                    medication_id: mReminderDetails.get('id')
                }

                let newMedication = await carePlanMedicationService.addCarePlanMedication(data_to_create);
                console.log("MEDICATIONNNNNNN=======>", medication);
            }


            console.log("BODYYY OF REQUESTTTTT=======>", carePlan, patient_id, care_plan_id);


            return this.raiseSuccess(res, 200, {
            }, "care plan medications ,appointments and actions added successfully");
        } catch (error) {
            console.log("Create Care Plan Medications And Appointments Error --> ", error);
            return this.raiseServerError(res, 500, error);
        }
    }

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


            let cPdetails = carePlan.get('details')?carePlan.get('details'):{};
           
            let { shown = false } = cPdetails;
            let carePlanId = carePlan.get('id');
            let carePlanTemplateId = carePlan.get('care_plan_template_id');
            let carePlanMedications = await carePlanMedicationService.getMedicationsByCarePlanId(carePlanId);
            let carePlanAppointments = await carePlanAppointmentService.getAppointmentsByCarePlanId(carePlanId);

            let carePlanAppointmentIds = await getCarePlanAppointmentIds(carePlanId);
            let carePlanMedicationIds = await getCarePlanMedicationIds(carePlanId);
            let carePlanSeverityDetails = await getCarePlanSeverityDetails(carePlanId);
            const carePlanApiWrapper = await CarePlanWrapper(carePlan);

            let carePlanApiData = {};

            carePlanApiData[
                carePlanApiWrapper.getCarePlanId()
            ] = { ...carePlanApiWrapper.getBasicInfo(), ...carePlanSeverityDetails, carePlanMedicationIds, carePlanAppointmentIds };




            let templateMedications = {};
            let templateAppointments = {};
            let formattedTemplateMedications = [];
            let formattedTemplateAppointments = [];
            if (carePlanTemplateId && !carePlanMedications.length && !carePlanAppointments.length) {
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
                        let medicine = await medicineService.getMedicineById(medicineId);
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


            console.log("CARE PLAN OF PATIENTTTT===========>>>>>>>", patient_id, carePlanId, shown
                , carePlanMedications, carePlanAppointments
                , show, carePlanTemplateId, carePlanMedicationsExists, carePlanAppointmentsExists);
            if (shown == false) {
                let details = cPdetails;
                details.shown = true;
                let updatedCarePlan = await carePlanService.updateCarePlan({ details }, carePlanId);
            }


            return this.raiseSuccess(res, 200, {
                care_plans: { ...carePlanApiData },
                show, medicationsOfTemplate, appointmentsOfTemplate, carePlanMedications, carePlanAppointments, carePlanTemplateId
            }, "patient care plan details fetched successfully");

        } catch (error) {
            console.log("GET PATIENT DETAILS ERROR --> ", error);
            return this.raiseServerError(res, 500, error);
        }
    }
}

export default new CarePlanController();