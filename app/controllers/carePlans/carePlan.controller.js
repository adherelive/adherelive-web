import Controller from "../";
import patientService from "../../../app/services/patients/patients.service";
import carePlanService from "../../services/carePlan/carePlan.service";
import CarePlanWrapper from "../../ApiWrapper/web/carePlan";
import appointmentService from "../../services/appointment/appointment.service";
import medicationReminderService from "../../services/medicationReminder/mReminder.service";
import carePlanMedicationService from "../../services/carePlanMedication/carePlanMedication.service";
import carePlanAppointmentService from "../../services/carePlanAppointment/carePlanAppointment.service";
import templateMedicationService from "../../services/templateMedication/templateMedication.service";
import templateAppointmentService from "../../services/templateAppointment/templateAppointment.service";
import medicineService from "../../services/medicine/medicine.service";
import { getCarePlanAppointmentIds, getCarePlanMedicationIds, getCarePlanSeverityDetails } from './carePlanHelper';
import { USER_CATEGORY } from "../../../constant";
import doctorService from "../../services/doctor/doctor.service";
import DoctorWrapper from "../../ApiWrapper/web/doctor";
import PatientWrapper from "../../ApiWrapper/web/patient";
import AppointmentWrapper from "../../ApiWrapper/web/appointments";
import MedicationWrapper from "../../ApiWrapper/web/medicationReminder";
import carePlanTemplateService from "../../services/carePlanTemplate/carePlanTemplate.service";
import CarePlanTemplateWrapper from "../../ApiWrapper/mobile/carePlanTemplate";
import Log from "../../../libs/log_new";
import moment from "moment";

Log.fileName("WEB > CAREPLAN > CONTROLLER");

class CarePlanController extends Controller {
    constructor() {
        super();
    }


    createCarePlanMedicationsAndAppointmentsByTemplateData = async (req, res) => {
        try {
            const { carePlanId: care_plan_id = 1 } = req.params;
            const { medicationsData, appointmentsData, treatment_id, condition_id, severity_id, name: newTemplateName, createTemplate = false } = req.body;

            const { userDetails } = req;
            const { userId, userData: { category } = {} } = userDetails || {};

            const id = parseInt(care_plan_id);

            const carePlan = await carePlanService.getCarePlanById(id);
            let carePlanData = await CarePlanWrapper(carePlan);

            console.log("====================> ", care_plan_id, id, carePlan, userDetails);
            const patient_id = carePlan.get('patient_id');

            let userCategoryId = null;

            let appointmentsArr = [];
            let medicationsArr = [];

            switch (category) {
                case USER_CATEGORY.DOCTOR:
                    const doctor = await doctorService.getDoctorByData({
                        user_id: userId
                    });
                    const doctorData = await DoctorWrapper(doctor);
                    userCategoryId = doctorData.getDoctorId();
                    break;
                case USER_CATEGORY.PATIENT:
                    const patient = await patientService.getPatientByUserId(userId);
                    const patientData = await PatientWrapper(patient);
                    userCategoryId = patientData.getPatientId();
                    break;
                default:
                    break;
            }

            for (const appointment of appointmentsData) {
                const {
                    schedule_data: { description = '', end_time = '', organizer = {}, treatment = '', participant_two = {}, start_time = '', date = '' } = {},
                    reason = '', time_gap = '' } = appointment || {};

                const { id: participant_two_id, category: participant_two_type } = participant_two || {};

                const getAppointmentForTimeSlot = await appointmentService.checkTimeSlot(
                    start_time,
                    end_time,
                    {
                        participant_one_id: userCategoryId,
                        participant_one_type: category,
                    },
                    {
                        participant_two_id,
                        participant_two_type,
                    }
                );

                if (getAppointmentForTimeSlot.length > 0) {
                    return this.raiseClientError(
                        res,
                        422,
                        {
                            error_type: "slot_present",
                        },
                        `Appointment Slot already present between`
                    );
                }
            };

            let appointmentApiDetails = {};
            let appointment_ids = [];

            for (const appointment of appointmentsData) {
                const {
                    schedule_data: { description = '', end_time = '', organizer = {}, type = "", type_description = "", treatment_id = '', participant_two = {}, start_time = '', date = '' } = {},
                    reason = '', time_gap = '', provider_id = null, provider_name = null, critical = false } = appointment;


                console.log('38748917239857893745917345891347051=====>', date);

                const { id: participant_two_id, category: participant_two_type } =
                    participant_two || {};

                let userCategoryId = null;

                switch (category) {
                    case USER_CATEGORY.DOCTOR:
                        const doctor = await doctorService.getDoctorByData({ user_id: userId });
                        const doctorData = await DoctorWrapper(doctor);
                        userCategoryId = doctorData.getDoctorId();
                        break;
                    case USER_CATEGORY.PATIENT:
                        const patient = await patientService.getPatientByUserId(userId);
                        const patientData = await PatientWrapper(patient);
                        userCategoryId = patientData.getPatientId();
                        break;
                    default:
                        break;
                }

                const appointment_data = {
                    participant_one_type: category,
                    participant_one_id: userCategoryId,
                    participant_two_type,
                    participant_two_id,
                    provider_id,
                    provider_name,
                    organizer_type:
                        Object.keys(organizer).length > 0 ? organizer.category : category,
                    organizer_id: Object.keys(organizer).length > 0 ? organizer.id : userCategoryId,
                    description,
                    start_date: date,
                    end_date: date,
                    start_time,
                    end_time,
                    details: {
                        treatment_id,
                        reason,
                        type,
                        type_description,
                        critical,
                    },
                };

                const baseAppointment = await appointmentService.addAppointment(
                    appointment_data
                );

                const newAppointment = await carePlanAppointmentService.addCarePlanAppointment({
                    care_plan_id,
                    appointment_id: baseAppointment.get('id')
                });

                const appointmentData = await AppointmentWrapper(baseAppointment);
                appointmentApiDetails[appointmentData.getAppointmentId()] = appointmentData.getBasicInfo();
                appointment_ids.push(appointmentData.getAppointmentId());

                appointmentsArr.push({
                    reason,
                    time_gap,
                    provider_id,
                    // care_plan_template_id: carePlanTemplate.getCarePlanTemplateId(),
                    details: {
                        date,
                        description,
                        type_description,
                        critical,
                        appointment_type: type
                    }
                });
            }

            let medicationApiDetails = {};
            let medication_ids = [];

            for (const medication of medicationsData) {
                const { schedule_data: { end_date = '', description = "", start_date = '', unit = '', when_to_take = '',
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

                const newMedication = await carePlanMedicationService.addCarePlanMedication(data_to_create);
                console.log("MEDICATIONNNNNNN=======>", medication);

                const medicationData = await MedicationWrapper(mReminderDetails);
                medicationApiDetails[medicationData.getMReminderId()] = medicationData.getBasicInfo();
                medication_ids.push(medicationData.getMReminderId());

                medicationsArr.push({
                    medicine_id,
                    // care_plan_template_id: carePlanTemplate.getCarePlanTemplateId(),
                    schedule_data: {
                        unit,
                        repeat,
                        quantity,
                        strength,
                        repeat_days,
                        when_to_take,
                        repeat_interval,
                        duration: moment(start_date).diff(moment(end_date), "days")
                    }
                });
            }


            console.log("BODYYY OF REQUESTTTTT=======>", carePlan, patient_id, care_plan_id);

            let carePlanTemplate = null;

            if(createTemplate) {
                const createCarePlanTemplate = await carePlanTemplateService.create({
                    name: newTemplateName,
                    treatment_id,
                    severity_id,
                    condition_id,
                    user_id: userId,
                    template_appointments: [...appointmentsArr],
                    template_medications: [...medicationsArr]
                });

                carePlanTemplate = await CarePlanTemplateWrapper(
                    createCarePlanTemplate
                );

                const updateCarePlan = await carePlanService.updateCarePlan({care_plan_template_id: carePlanTemplate.getCarePlanTemplateId()}, care_plan_id);

                carePlanData = await CarePlanWrapper(null, care_plan_id);
                // await carePlanTemplate.getReferenceInfo();
                Log.debug(
                    "appointmentsData --------------------->",
                    createCarePlanTemplate
                );
            }


            return this.raiseSuccess(res, 200, {
                care_plans: {
                    [carePlanData.getCarePlanId()]: {
                        ...carePlanData.getBasicInfo(),
                        appointment_ids,
                        medication_ids
                    }
                },
                appointments: {
                    ...appointmentApiDetails
                },
                medications: {
                    ...medicationApiDetails
                },
                ...carePlanTemplate ? await carePlanTemplate.getReferenceInfo() : {},
            }, "Care plan medications, appointments and actions added successfully");
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


            let cPdetails = carePlan.get('details') ? carePlan.get('details') : {};

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
