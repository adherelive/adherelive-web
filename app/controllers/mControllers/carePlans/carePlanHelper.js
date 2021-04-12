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

// services
import vitalService from "../../../services/vitals/vital.service";

// wrappers
import AppointmentWrapper from "../../../ApiWrapper/mobile/appointments";
import MedicationWrapper from "../../../ApiWrapper/mobile/medicationReminder";
import VitalWrapper from "../../../ApiWrapper/mobile/vitals";
import PatientWrapper from "../../../ApiWrapper/mobile/patient";

import Logger from "../../../../libs/log";
import {EVENT_LONG_TERM_VALUE, EVENT_TYPE, USER_CATEGORY} from "../../../../constant";
import moment from "moment";

const Log = new Logger("CARE_PLAN > HELPER");

export const getCareplanData = async ({carePlans = [], userCategory, doctorId , userRoleId }) => {
    try {
        let carePlanData = {};
        let carePlanIds = [];

        let appointmentData = {};
        let appointmentIds = [];

        let medicationData = {};
        let medicationIds = [];

        let medicineData = {};

        let scheduleEventData = {};

        let doctorData = {};

        let currentCareplanTime = null;
        let currentCareplanId = null;

        for(let index = 0; index < carePlans.length; index++) {
            const careplan = await CarePlanWrapper(carePlans[index]);
            const {care_plans, doctors, doctor_id} = await careplan.getReferenceInfo();
            carePlanData = {...carePlanData, ...care_plans};
            carePlanIds.push(careplan.getCarePlanId());

            doctorData = {...doctorData, ...doctors};

            const {medication_ids, appointment_ids , basic_info : {user_role_id = null } = {}} = care_plans[careplan.getCarePlanId()] || {};
            appointmentIds = [...appointmentIds, ...appointment_ids];
            medicationIds = [...medicationIds, ...medication_ids];

            // get latest careplan id
            Log.debug("7123731 careplan --> ", careplan.getCreatedAt());
            Log.debug("71237312 careplan --> ", moment(currentCareplanTime));
            if(userCategory === USER_CATEGORY.DOCTOR && user_role_id.toString() === userRoleId.toString() ) {
                if (
                    moment(careplan.getCreatedAt()).diff(
                        moment(currentCareplanTime),
                        "minutes"
                    ) > 0
                ) {
                    currentCareplanTime = careplan.getCreatedAt();
                    currentCareplanId = careplan.getCarePlanId();
                }

                if (currentCareplanTime === null) {
                    currentCareplanTime = careplan.getCreatedAt();
                    currentCareplanId = careplan.getCarePlanId();
                }
            }
        }

        Log.info(`8912731893 currentCareplanId ${currentCareplanId}`);

        // appointments
        const allAppointments = await appointmentService.getAppointmentByData({
            id: appointmentIds
        }) || [];

        if(allAppointments.length > 0) {
            for(let index = 0; index < allAppointments.length; index++) {
                const appointment = await AppointmentWrapper(allAppointments[index]);
                const {appointments, schedule_events} = await appointment.getAllInfo();
                appointmentData = {...appointmentData, ...appointments};
                scheduleEventData = {...scheduleEventData, ...schedule_events};
            }
        }

        // medications
        const allMedications = await medicationReminderService.getAllMedicationByData({
            id: medicationIds
        }) || [];

        if(allMedications.length > 0) {
            for(let index = 0; index < allMedications.length; index++) {
                const medication = await MedicationWrapper(allMedications[index]);
                const {medications, medicines, schedule_events} = await medication.getReferenceInfo();
                medicationData = {...medicationData, ...medications};
                medicineData = {...medicineData, ...medicines};
                scheduleEventData = {...scheduleEventData, ...schedule_events};
            }
        }

        return {
            care_plans: {
                ...carePlanData
            },
            appointments: {
                ...appointmentData
            },
            medications: {
                ...medicationData
            },
            medicines: {
                ...medicineData
            },
            schedule_events: {
                ...scheduleEventData
            },
            doctors: {
                ...doctorData
            },
            care_plan_ids: carePlanIds,
            current_careplan_id: currentCareplanId
        };
    } catch(error) {
        Log.debug("getCareplanData catch error", error);
        return {};
    }
};

export const createVitals = async ({data = [], carePlanId, authUser, patientId}) => {
    try {
        // vitals
        let vitalData = {};
        let vitalIds = [];

        // vital templates
        let vitalTemplateData = {};

        // template vital for careplan template
        let carePlanTemplateVitals = [];

        // for sqs events
        let vitalEventsData = [];

        const {userId: authUserId, category: authCategory, userCategoryData: authUserCategoryData} = authUser || {};

        // patient
        const patient = await PatientWrapper(null, patientId);

        console.log("198187238 data ---> ", data);

        if(data.length > 0) {
            for(let index = 0; index < data.length; index++) {
                const {
                    vital_template_id,
                    repeat_interval_id,
                    start_date,
                    end_date,
                    repeat_days,
                    description,
                } = data[index];

                const addedVital = await vitalService.addVital({
                    vital_template_id,
                    start_date,
                    end_date,
                    description,
                    details: {
                        repeat_interval_id,
                        repeat_days,
                    },
                    care_plan_id: carePlanId,
                });

                const vital = await VitalWrapper({data: addedVital});
                const {vitals, vital_templates} = await vital.getReferenceInfo();

                vitalData = {...vitalData, ...vitals};
                vitalIds.push(vital.getVitalId());

                vitalTemplateData = {...vitalTemplateData, ...vital_templates};

                carePlanTemplateVitals.push({
                    vital_template_id,
                    details: {
                        description,
                        repeat_interval_id,
                        repeat_days,
                        duration: end_date ? moment(end_date).diff(moment(start_date), "days") : EVENT_LONG_TERM_VALUE
                    }
                });

                // update vitalEvents for sqs
                vitalEventsData.push({
                    type: EVENT_TYPE.VITALS,
                    patient_id: patient.getPatientId(),
                    patientUserId: patient.getUserId(),
                    event_id: vital.getVitalId(),
                    event_type: EVENT_TYPE.VITALS,
                    critical: false,
                    start_date,
                    end_date,
                    details: vital.getBasicInfo(),
                    participants: [authUserId, patient.getUserId()],
                    actor: {
                        id: authUserId,
                        category: authCategory,
                        userCategoryData: authUserCategoryData
                    },
                    vital_templates: vital_templates[vital.getVitalTemplateId()]
                });
            }
        }

        return {
            carePlanTemplateVitals,
            vitalEventsData,
            vitals: vitalData,
            vital_ids: vitalIds,
            vital_templates: vitalTemplateData,
        };
    } catch(error) {
        Log.debug("createVitals catch error", error);
        return {};
    }
};


export const getCarePlanAppointmentIds =async(carePlanId)=>{

    let carePlanAppointments = await carePlanAppointmentService.getAppointmentsByCarePlanId(carePlanId);
    let carePlanAppointmentIds=[];
    for (let appointment of carePlanAppointments){
         
        let appointmentId=appointment.get('appointment_id');
        carePlanAppointmentIds.push(appointmentId);
    }

    return carePlanAppointmentIds
}

export const getCarePlanMedicationIds =async(carePlanId)=>{


    let carePlanMedications = await carePlanMedicationService.getMedicationsByCarePlanId(carePlanId);
    let carePlanMedicationIds =[];
    
     for (let medication of carePlanMedications){
        let medicationId=medication.get('medication_id');
        carePlanMedicationIds.push(medicationId);   

     }

     return carePlanMedicationIds;
}

export const getCarePlanSeverityDetails =async(carePlanId)=>{

    let carePlan= await carePlanService.getCarePlanById(carePlanId);

    const carePlanApiWrapper = await CarePlanWrapper(carePlan);

    let  treatment = '';
    let severity = '';
    let condition = '';
    let carePlanTemplate={};

    const templateId = carePlanApiWrapper.getCarePlanTemplateId();
    if(templateId){
        carePlanTemplate= await carePlanTemplateService.getCarePlanTemplateById(templateId);
        treatment = carePlanTemplate.get('treatment_id')?carePlanTemplate.get('treatment_id'):'';
        severity = carePlanTemplate.get('severity_id')?carePlanTemplate.get('severity_id'):'';
        condition =carePlanTemplate.get('condition_id')?carePlanTemplate.get('condition_id'):'';
    }else{
        let details=carePlanApiWrapper.getCarePlanDetails();
        treatment=details.treatment_id;
        severity=details.severity_id;
        condition=details.condition_id;
    }

    return {treatment_id: treatment,severity_id: severity,condition_id: condition};
}