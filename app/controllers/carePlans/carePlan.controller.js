import Controller from "../";
import userService from "../../../app/services/user/user.service";
import patientService from "../../../app/services/patients/patients.service";
import minioService from "../../../app/services/minio/minio.service";
import carePlanService from "../../services/carePlan/carePlan.service";
import appointmentService from "../../services/appointment/appointment.service";
import medicationReminderService from "../../services/medicationReminder/mReminder.service";
import carePlanMedicationService from "../../services/carePlanMedication/carePlanMedication.service";
import carePlanAppointmentService from "../../services/carePlanAppointment/carePlanAppointment.service";
import templateMedicationService from "../../services/templateMedication/templateMedication.service";
import templateAppointmentService from "../../services/templateAppointment/templateAppointment.service";
import medicineService from "../../services/medicine/medicine.service";
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
             
            const id=parseInt(care_plan_id);

            const carePlan = await carePlanService.getCarePlanById(id);
             
            console.log("====================> ", care_plan_id,id,carePlan,userDetails);
            const patient_id = carePlan.get('patient_id');

            for (let medication of medicationsData) {
                let { schedule_data: { end_date = '',description="", start_date = '', unit = '', when_to_take = '',
                    repeat = '', quantity = '', repeat_days = [], strength = '', start_time = '', repeat_interval='',medication_stage=''} = {},
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

            for (let appointment of appointmentsData) {
                let {
                    schedule_data: { description = '', end_time = '',organizer={},treatment='', participant_two = {}, start_time = '', date = '' } = {},
                    reason = '', time_gap = '' } = appointment;



            console.log("AppointmentTTTTTTTTT=======>", care_plan_id,date,appointment);
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
                   appointment_id:baseAppointment.get('id')
                }

                let newAppointment = await carePlanAppointmentService.addCarePlanAppointment(data_to_create);

            }

            console.log("BODYYY OF REQUESTTTTT=======>",carePlan,patient_id, care_plan_id);


            return this.raiseSuccess(res, 200, {
            }, "care plan medications ,appointments and actions added successfully");
        } catch (error) {
            console.log("Create Care Plan Medications And Appointments Error --> ", error);
            return this.raiseServerError(res, 500, error);
        }
    }
}

export default new CarePlanController();