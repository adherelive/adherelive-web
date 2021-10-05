import Controller from "../../index";
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
import careplanSecondaryDoctorMappingService
    from "../../../services/careplanSecondaryDoctorMappings/careplanSecondaryDoctorMappings.service";
import twilioService from "../../../services/twilio/twilio.service";

import * as carePlanHelper from "./carePlanHelper";
import {getCarePlanAppointmentIds, getCarePlanMedicationIds, getCarePlanSeverityDetails} from "./carePlanHelper";
import {
    EVENT_LONG_TERM_VALUE,
    EVENT_STATUS,
    EVENT_TYPE,
    USER_CATEGORY,
    WHEN_TO_TAKE_ABBREVATIONS,
} from "../../../../constant";
import PatientWrapper from "../../../ApiWrapper/mobile/patient";
import AppointmentWrapper from "../../../ApiWrapper/mobile/appointments";
import MedicationWrapper from "../../../ApiWrapper/mobile/medicationReminder";
import CarePlanTemplateWrapper from "../../../ApiWrapper/mobile/carePlanTemplate";
// import Log from "../../../../libs/log_new";
import queueService from "../../../services/awsQueue/queue.service";
// import SqsQueueService from "../../../services/awsQueue/queue.service";
import ScheduleEventService from "../../../services/scheduleEvents/scheduleEvent.service";
import moment from "moment";
import PERMISSIONS from "../../../../config/permissions";

import Logger from "../../../../libs/log";

const Log = new Logger("MOBILE > CARE_PLAN > CONTROLLER");

class CarePlanController extends Controller {
    constructor() {
        super();
    }

    createFromTemplate = async (req, res) => {
        const {raiseSuccess, raiseClientError, raiseServerError} = this;
        try {
            const {carePlanId: care_plan_id} = req.params;
            const {
                medicationsData,
                appointmentsData,
                vitalData,
                dietData,
                workoutData,
                treatment_id,
                condition_id,
                severity_id,
                name: newTemplateName,
                createTemplate = false,
            } = req.body;

            const {userDetails, permissions = []} = req;
            const {userId, userRoleId, userData: {category} = {}, userCategoryId, userCategoryData} =
            userDetails || {};
            const QueueService = new queueService();

            if (!permissions.includes(PERMISSIONS.MEDICATIONS.ADD) && medicationsData.length > 0) {
                return raiseClientError(
                    res,
                    422,
                    {},
                    `Medication creation is not allowed. Please remove the same to continue`
                );
            }

            if (!care_plan_id) {
                return raiseClientError(
                    res,
                    422,
                    {},
                    `Please select a treatment plan to continue`
                );
            }

            const templateNameCheck = await carePlanTemplateService.getSingleTemplateByData(
                {
                    name: newTemplateName,
                    user_id: userId,
                }
            );

            if (templateNameCheck) {
                return raiseClientError(
                    res,
                    422,
                    {},
                    `A template exists with name ${newTemplateName}`
                );
            }

            // switch (category) {
            //   case USER_CATEGORY.DOCTOR:
            //     const doctor = await doctorService.getDoctorByData({
            //       user_id: userId
            //     });
            //     const doctorData = await DoctorWrapper(doctor);
            //     userCategoryId = doctorData.getDoctorId();
            //     break;
            //   case USER_CATEGORY.PATIENT:
            //     const patient = await patientService.getPatientByUserId(userId);
            //     const patientData = await PatientWrapper(patient);
            //     userCategoryId = patientData.getPatientId();
            //     break;
            //   default:
            //     break;
            // }

            const id = parseInt(care_plan_id);

            const carePlan = await carePlanService.getCarePlanById(id);
            let carePlanData = await CarePlanWrapper(carePlan);

            const patient_id = carePlan.get("patient_id");

            let appointmentApiDetails = {};
            let appointment_ids = [];
            let appointmentEventData = [];

            let carePlanScheduleData = {};

            let appointmentsArr = [];
            let medicationsArr = [];

            if (appointmentsData.length > 0) {
                for (let i = 0; i < appointmentsData.length; i++) {
                    const {
                        schedule_data: {
                            description = "",
                            organizer = {},
                            treatment_id = "",
                            participant_two = {},
                            date = "",
                            start_time = "",
                            end_time = "",
                        } = {},
                        reason = "",
                        time_gap = "",
                        provider_id = null,
                        provider_name = null,
                        type = "",
                        type_description = "",
                        critical = false,
                        radiology_type = "",
                    } = appointmentsData[i];

                    const {id: participant_two_id, category: participant_two_type} =
                    participant_two || {};

                    // let userCategoryId = null;
                    // let participantTwoId = null;

                    // switch (category) {
                    //   case USER_CATEGORY.DOCTOR:
                    //     const doctor = await doctorService.getDoctorByData({
                    //       user_id: userId
                    //     });
                    //     const doctorData = await DoctorWrapper(doctor);
                    //     userCategoryId = doctorData.getDoctorId();
                    //     // participantTwoId = doctorData.getUserId();
                    //     break;
                    //   case USER_CATEGORY.PATIENT:
                    //     const patient = await patientService.getPatientByUserId(userId);
                    //     const patientData = await PatientWrapper(patient);
                    //     userCategoryId = patientData.getPatientId();
                    //     // participantTwoId = patientData.getUserId();
                    //     break;
                    //   default:
                    //     break;
                    // }

                    const appointment_data = {
                        participant_one_type: category,
                        participant_one_id: userCategoryId,
                        participant_two_type,
                        participant_two_id,
                        organizer_type: category,
                        organizer_id: userCategoryId,
                        description,
                        start_date: date,
                        end_date: date,
                        start_time: null,
                        end_time: null,
                        provider_id,
                        provider_name,
                        details: {
                            treatment_id,
                            reason,
                            type,
                            type_description,
                            critical,
                            radiology_type,
                        },
                    };

                    const baseAppointment = await appointmentService.addAppointment(
                        appointment_data
                    );

                    const newAppointment = await carePlanAppointmentService.addCarePlanAppointment(
                        {
                            care_plan_id,
                            appointment_id: baseAppointment.get("id"),
                        }
                    );

                    const appointmentData = await AppointmentWrapper(baseAppointment);
                    appointmentApiDetails[
                        appointmentData.getAppointmentId()
                        ] = appointmentData.getBasicInfo();
                    appointment_ids.push(appointmentData.getAppointmentId());

                    appointmentsArr.push({
                        reason,
                        time_gap,
                        provider_id,
                        details: {
                            date,
                            description,
                            type_description,
                            critical,
                            appointment_type: type,
                            radiology_type,
                        },
                    });

                    appointmentEventData.push({
                        type: EVENT_TYPE.APPOINTMENT_TIME_ASSIGNMENT,
                        event_id: appointmentData.getAppointmentId(),
                        user_role_id: userRoleId,
                        start_time,
                        end_time,
                    });

                    // const sqsResponse = await QueueService.sendMessage(
                    //     eventScheduleData
                    // );
                    //
                    // Log.debug("sqsResponse ---> ", sqsResponse);
                }
            }
            // careplan part starts.

            const carePlanStartTime = new moment.utc();
            const carePlanEndTime = new moment.utc(carePlanStartTime).add(2, "hours");
            const patient = await PatientWrapper(null, patient_id);
            const {user_role_id: patientRoleId} = await patient.getAllInfo();

            if (permissions.includes(PERMISSIONS.MEDICATIONS.ADD)) {
                carePlanScheduleData = {
                    ...carePlanScheduleData,
                    type: EVENT_TYPE.CARE_PLAN_ACTIVATION,
                    event_id: care_plan_id,
                    critical: false,
                    start_time: carePlanStartTime,
                    end_time: carePlanEndTime,
                    details: JSON.stringify(medicationsData),
                    participants: [userRoleId, patientRoleId],
                    actor: {
                        id: userId,
                        user_role_id: userRoleId,
                        category
                    }
                };
            }

            // const sqsResponseforCareplan = await QueueService.sendMessage(
            //   carePlanScheduleData
            // );
            //
            // Log.debug("sqsResponse for care plan---> ", sqsResponseforCareplan);

            let medicationApiDetails = {};
            let medication_ids = [];

            let medicineApiDetails = {};

            if (permissions.includes(PERMISSIONS.MEDICATIONS.ADD) && medicationsData.length > 0) {
                for (const medication of medicationsData) {
                    const {
                        schedule_data: {
                            end_date = "",
                            description = "",
                            start_date = "",
                            unit = "",
                            when_to_take = "",
                            when_to_take_abbr = null,
                            repeat = "",
                            quantity = "",
                            repeat_days = [],
                            strength = "",
                            start_time = "",
                            repeat_interval = "",
                            medication_stage = "",
                            critical = false,
                        } = {},
                        medicine_id = "",
                        medicine_type = "1",
                    } = medication;

                    const dataToSave = {
                        participant_id: patient_id,
                        organizer_type: category,
                        organizer_id: userId,
                        medicine_id,
                        description,
                        start_date,
                        end_date,
                        details: {
                            medicine_id,
                            medicine_type,
                            start_time: start_time ? start_time : moment(),
                            end_time: start_time ? start_time : moment(),
                            repeat,
                            repeat_days,
                            repeat_interval,
                            quantity,
                            strength,
                            unit,
                            when_to_take,
                            when_to_take_abbr,
                            medication_stage,
                            critical,
                        },
                    };

                    const mReminderDetails = await medicationReminderService.addMReminder(
                        dataToSave
                    );

                    const medicationWrapper = await MedicationWrapper(mReminderDetails);

                    const data_to_create = {
                        care_plan_id,
                        medication_id: medicationWrapper.getMReminderId(),
                    };

                    let newMedication = await carePlanMedicationService.addCarePlanMedication(
                        data_to_create
                    );

                    const {
                        medications,
                        medicines,
                    } = await medicationWrapper.getReferenceInfo();
                    medicationApiDetails = {...medicationApiDetails, ...medications};
                    medicineApiDetails = {...medicineApiDetails, ...medicines};

                    medication_ids.push(medicationWrapper.getMReminderId());

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
                            when_to_take_abbr,
                            repeat_interval,
                            medicine_type,
                            duration: end_date
                                ? moment(end_date).diff(moment(start_date), "days")
                                : EVENT_LONG_TERM_VALUE,
                        },
                    });
                }
            }

            carePlanScheduleData = {
                ...(permissions.includes(PERMISSIONS.MEDICATIONS.ADD)) &&
                {
                    ...carePlanScheduleData,
                    medication_ids
                }
            };

            // vitals ----------------------------------------
            const {
                vitals,
                vital_ids,
                vital_templates,
                vitalEventsData = [],
                carePlanTemplateVitals = [],
            } = await carePlanHelper.createVitals({
                data: vitalData,
                carePlanId: care_plan_id,
                authUser: {category, userId, userCategoryData, userRoleId},
                patientId: carePlanData.getPatientId(),
            });

            // diets ----------------------------------------
            const {
                diets,
                food_groups,
                food_items,
                food_item_details,
                portions,
                diet_ids,
                dietEventData,
                carePlanTemplateDiets,
            } = await carePlanHelper.createDiet({
                data: dietData,
                carePlanId: care_plan_id,
                authUser: {category, userId, userCategoryData, userRoleId},
                patientId: carePlanData.getPatientId(),
            });

            // workouts ----------------------------------------
            const {
                workouts,
                exercise_groups,
                exercises,
                exercise_details,
                repetitions,
                workout_ids,
                workoutEventData,
                carePlanTemplateWorkouts,
            } = await carePlanHelper.createWorkout({
                data: workoutData,
                carePlanId: care_plan_id,
                authUser: {category, userId, userCategoryData, userRoleId},
                patientId: carePlanData.getPatientId(),
            });

            let carePlanTemplate = null;

            if (createTemplate) {
                const createCarePlanTemplate = await carePlanTemplateService.create({
                    name: newTemplateName,
                    treatment_id,
                    severity_id,
                    condition_id,
                    user_id: userId,
                    template_appointments: [...appointmentsArr],
                    ...(permissions.includes(PERMISSIONS.MEDICATIONS.ADD)) && {template_medications: [...medicationsArr]},
                    template_vitals: [...carePlanTemplateVitals],
                    template_diets: [...carePlanTemplateDiets],
                    template_workouts: [...carePlanTemplateWorkouts],
                });

                carePlanTemplate = await CarePlanTemplateWrapper(
                    createCarePlanTemplate
                );

                await carePlanService.updateCarePlan(
                    {care_plan_template_id: carePlanTemplate.getCarePlanTemplateId()},
                    care_plan_id
                );

                carePlanData = await CarePlanWrapper(null, care_plan_id);
                // await carePlanTemplate.getReferenceInfo();
            }

            // sending batch message of appointments and vitals
            const sqsResponse = await QueueService.sendBatchMessage([
                ...appointmentEventData,
                ...vitalEventsData,
                ...dietEventData,
                ...workoutEventData,
                carePlanScheduleData,
            ]);

            return this.raiseSuccess(
                res,
                200,
                {
                    care_plans: {
                        [carePlanData.getCarePlanId()]: {
                            ...carePlanData.getBasicInfo(),
                            appointment_ids,
                            ...(permissions.includes(PERMISSIONS.MEDICATIONS.ADD)) && {medication_ids},
                            vital_ids,
                            diet_ids,
                            workout_ids,
                        },
                    },
                    appointments: {
                        ...appointmentApiDetails,
                    },
                    ...(permissions.includes(PERMISSIONS.MEDICATIONS.ADD)) && {
                        medications: {
                            ...medicationApiDetails,
                        }
                    }
                    ,
                    vitals,
                    vital_templates,

                    diets,
                    food_groups,
                    food_items,
                    food_item_details,
                    portions,

                    workouts,
                    exercise_groups,
                    exercises,
                    exercise_details,
                    repetitions,

                    ...(carePlanTemplate
                        ? await carePlanTemplate.getReferenceInfo()
                        : {}),
                },
                "Care plan medications, appointments, actions, diets and exercises added successfully"
            );
        } catch (error) {
            console.log(
                "Create Care Plan Medications And Appointments Error --> ",
                error
            );
            return this.raiseServerError(res, 500, error);
        }
    };

    activateCarePlan = async (req, res) => {
        try {
            const {carePlanId: care_plan_id = 1} = req.params;
            const {activate = false, schedule_event_id = null} = req.body;

            const id = parseInt(care_plan_id);
            const schedule_event_id_value = parseInt(schedule_event_id);
            const scheduleEventService = new ScheduleEventService();

            const carePlan = await carePlanService.getCarePlanById(id);
            let carePlanData = await CarePlanWrapper(carePlan);

            const eventData = await scheduleEventService.getEventByData({
                event_id: care_plan_id,
                status: EVENT_STATUS.SCHEDULED,
                event_type: EVENT_TYPE.CARE_PLAN_ACTIVATION,
            });

            if (!eventData || !Object.keys(eventData)) {
                return this.raiseClientError(
                    res,
                    422,
                    {},
                    `Response has been already recorded for this notification.`
                );
            }

            if (!activate) {
                const now = new moment.utc();
                const care_plan_start_time = new moment.utc(now).add(2, "hours");
                const end_time = new moment.utc(now).add(4, "hours");

                const updateEventStatus = await scheduleEventService.update(
                    {
                        status: EVENT_STATUS.PENDING,
                        start_time: care_plan_start_time,
                        end_time,
                    },
                    schedule_event_id_value
                );

                return this.raiseSuccess(
                    res,
                    200,
                    {
                        care_plans: {
                            [carePlanData.getCarePlanId()]: {
                                ...carePlanData.getBasicInfo(),
                            },
                        },
                    },
                    "Care plan delayed successfully."
                );
            }

            const patient_id = carePlan.get("patient_id");

            const {
                details: {
                    medications = {},
                    medication_ids = [],
                    actor: {id: organizer_id = null, category} = {},
                    actor = {}
                } = {}
            } = eventData;
            const medicationsData = JSON.parse(medications);

            let medicationApiDetails = {};
            // let medicationIds = [];
            let medicineApiDetails = {};

            let eventScheduleData = [];

            for (let index = 0; index < medication_ids.length; index++) {
                // Log.debug("1698727 medications", medicationsData);
                // Log.debug("1698727 index", index);
                // const currentMedication =
                const {
                    schedule_data: {end_date = "", start_date = ""} = {},
                } = medicationsData[index];

                const duration = end_date
                    ? moment(end_date).diff(moment(start_date), "days")
                    : EVENT_LONG_TERM_VALUE;

                const updatedStartDate = moment().utc();
                const updatedEndDate = duration
                    ? moment(updatedStartDate)
                        .utc()
                        .add(duration, "days")
                    : EVENT_LONG_TERM_VALUE;

                // check for medication
                const medicationExists =
                    (await medicationReminderService.getMedication({
                        id: medication_ids[index],
                    })) || null;

                if (medicationExists) {
                    await medicationReminderService.updateMedication(
                        {
                            start_date: updatedStartDate,
                            end_date: updatedEndDate,
                        },
                        medication_ids[index]
                    );

                    const medication = await MedicationWrapper(
                        null,
                        medication_ids[index]
                    );

                    // medicationApiDetails[
                    //     medication.getMReminderId()
                    //     ] = await medication.getAllInfo();
                    const {
                        medications,
                        medicines,
                    } = await medication.getReferenceInfo();
                    medicationApiDetails = {...medicationApiDetails, ...medications};
                    // medicationIds.push(medication.getMReminderId());
                    medicineApiDetails = {...medicineApiDetails, ...medicines};

                    const patient = await PatientWrapper(null, patient_id);

                    const {
                        details: {when_to_take, when_to_take_abbr = null} = {},
                    } = medication.getDetails();

                    if (when_to_take_abbr !== WHEN_TO_TAKE_ABBREVATIONS.SOS) {
                        eventScheduleData.push({
                            patient_id: patient.getUserId(),
                            type: EVENT_TYPE.MEDICATION_REMINDER,
                            event_id: medication.getMReminderId(),
                            details: medication.getDetails(),
                            status: EVENT_STATUS.SCHEDULED,
                            start_date: medication.getStartDate(),
                            end_date: medication.getEndDate(),
                            when_to_take,
                            // participant_one: patient.getUserId(),
                            // participant_two: organizer_id,
                            actor
                        });
                    }
                }

                // const QueueService = new queueService();
                // const sqsResponse = await QueueService.sendMessage(eventScheduleData);
                // Log.debug("sqsResponse ---> ", sqsResponse);
            }

            const QueueService = new queueService();
            await QueueService.sendBatchMessage(eventScheduleData);
            // for (const medication of medicationsData) {
            //   console.log(
            //     "medication value for current medication data is: ",
            //     medication
            //   );
            //   const {
            //     schedule_data: {
            //       end_date = "",
            //       description = "",
            //       start_date = "",
            //       unit = "",
            //       when_to_take = "",
            //       repeat = "",
            //       quantity = "",
            //       repeat_days = [],
            //       strength = "",
            //       start_time = "",
            //       repeat_interval = "",
            //       medication_stage = ""
            //     } = {},
            //     medicine_id = "",
            //     medicine_type = "1"
            //   } = medication;
            //
            //   const duration = moment(start_date).diff(moment(end_date), "days");
            //   console.log(
            //     "difference in milliseconds is: ",
            //     duration,
            //     start_date,
            //     end_date
            //   );
            //
            //   const updatedStartDate = new moment().utc();
            //   const updatedEndDate = new moment.utc(updatedStartDate).add(
            //     duration,
            //     "days"
            //   );
            //
            //   console.log("updated times are: ", updatedStartDate, updatedEndDate);
            //
            //   const dataToSave = {
            //     participant_id: patient_id,
            //     organizer_type: category,
            //     organizer_id,
            //     description,
            //     start_date: updatedStartDate,
            //     end_date: updatedEndDate,
            //     medicine_id,
            //     details: {
            //       medicine_id,
            //       medicine_type,
            //       start_time: start_time ? start_time : moment(),
            //       end_time: start_time ? start_time : moment(),
            //       repeat,
            //       repeat_days,
            //       repeat_interval,
            //       quantity,
            //       strength,
            //       unit,
            //       when_to_take,
            //       medication_stage
            //     }
            //   };
            //
            //   const mReminderDetails = await medicationReminderService.addMReminder(
            //     dataToSave
            //   );
            //
            //   const data_to_create = {
            //     care_plan_id,
            //     medication_id: mReminderDetails.get("id")
            //   };
            //
            //   const newMedication = await carePlanMedicationService.addCarePlanMedication(
            //     data_to_create
            //   );
            //   console.log("MEDICATIONNNNNNN=======>", medication);
            //
            //   const medicationData = await MedicationWrapper(mReminderDetails);
            //   medicationApiDetails[
            //     medicationData.getMReminderId()
            //   ] = medicationData.getBasicInfo();
            //   medication_ids.push(medicationData.getMReminderId());
            //
            //   const patient = await PatientWrapper(null, patient_id);
            //
            //   const eventScheduleData = {
            //     patient_id: patient.getUserId(),
            //     type: EVENT_TYPE.MEDICATION_REMINDER,
            //     event_id: mReminderDetails.getId,
            //     details: mReminderDetails.getBasicInfo.details,
            //     status: EVENT_STATUS.SCHEDULED,
            //     start_date,
            //     end_date,
            //     when_to_take,
            //     participant_one: patient.getUserId(),
            //     participant_two: organizer_id
            //   };
            //
            //   const QueueService = new queueService();
            //   const sqsResponse = await QueueService.sendMessage(eventScheduleData);
            //   Log.debug("sqsResponse ---> ", sqsResponse);
            // }

            await scheduleEventService.update(
                {
                    status: EVENT_STATUS.COMPLETED,
                },
                schedule_event_id_value
            );

            return this.raiseSuccess(
                res,
                200,
                {
                    care_plans: {
                        [carePlanData.getCarePlanId()]: {
                            ...carePlanData.getBasicInfo(),
                            medication_ids,
                        },
                    },
                    medications: {
                        ...medicationApiDetails,
                    },
                    medicines: {
                        ...medicineApiDetails,
                    },
                },
                "Care plan activated successfully."
            );
        } catch (error) {
            Log.debug("activateCarePlan 500 error", error);
            return this.raiseServerError(res, 500);
        }
    };

    getPatientCarePlanDetails = async (req, res) => {
        const {patientId: patient_id = 1} = req.params;
        try {
            const {userDetails: {userId, userRoleId = null, userData: {category} = {}, permissions = []} = {}} = req;

            let show = false;

            let carePlan = await carePlanService.getSingleCarePlanByData({
                patient_id,
                ...(category === USER_CATEGORY.DOCTOR || category === USER_CATEGORY.HSP) && {'user_role_id': userRoleId}
            });

            let cPdetails = carePlan.get("details") ? carePlan.get("details") : {};

            let {shown = false} = cPdetails;
            let carePlanId = carePlan.get("id");
            let carePlanTemplateId = carePlan.get("care_plan_template_id");
            let carePlanMedications = await carePlanMedicationService.getMedicationsByCarePlanId(
                carePlanId
            );
            let carePlanAppointments = await carePlanAppointmentService.getAppointmentsByCarePlanId(
                carePlanId
            );

            let carePlanAppointmentIds = await getCarePlanAppointmentIds(carePlanId);
            let carePlanMedicationIds = await getCarePlanMedicationIds(carePlanId);
            let carePlanSeverityDetails = await getCarePlanSeverityDetails(
                carePlanId
            );
            const carePlanApiWrapper = await CarePlanWrapper(carePlan);

            let carePlanApiData = {};

            carePlanApiData[carePlanApiWrapper.getCarePlanId()] = {
                ...carePlanApiWrapper.getBasicInfo(),
                ...carePlanSeverityDetails,
                carePlanMedicationIds,
                carePlanAppointmentIds,
            };

            let templateMedications = {};
            let templateAppointments = {};
            let formattedTemplateMedications = [];
            let formattedTemplateAppointments = [];
            if (
                carePlanTemplateId &&
                !carePlanMedications.length &&
                !carePlanAppointments.length
            ) {
                templateMedications = await templateMedicationService.getMedicationsByCarePlanTemplateId(
                    carePlanTemplateId
                );
                templateAppointments = await templateAppointmentService.getAppointmentsByCarePlanTemplateId(
                    carePlanTemplateId
                );
                if (permissions.includes(PERMISSIONS.MEDICATIONS.VIEW) && templateMedications.length) {
                    for (let medication of templateMedications) {
                        let newMedication = {};
                        newMedication.id = medication.get("id");
                        newMedication.schedule_data = medication.get("schedule_data");
                        newMedication.care_plan_template_id = medication.get(
                            "care_plan_template_id"
                        );
                        let medicineId = medication.get("medicine_id");
                        newMedication.medicine_id = medicineId;
                        let medicine = await medicineService.getMedicineById(medicineId);
                        // console.log("CARE PLAN OF PATIENTTTT===========>>>>>>>", medicine);
                        let medName = medicine.get("name");
                        let medType = medicine.get("type");
                        newMedication.medicine = medName;
                        newMedication.medicineType = medType;
                        formattedTemplateMedications.push(newMedication);
                    }
                }

                if (templateAppointments.length) {
                    for (let appointment of templateAppointments) {
                        let newAppointment = {};
                        newAppointment.id = appointment.get("id");
                        newAppointment.schedule_data = appointment.get("details");
                        newAppointment.reason = appointment.get("reason");
                        newAppointment.time_gap = appointment.get("time_gap");
                        newAppointment.care_plan_template_id = appointment.get(
                            "care_plan_template_id"
                        );
                        formattedTemplateAppointments.push(newAppointment);
                    }
                }
            }

            let medicationsOfTemplate = {};

            if (permissions.includes(PERMISSIONS.MEDICATIONS.VIEW)) {
                medicationsOfTemplate = formattedTemplateMedications;
            }
            let appointmentsOfTemplate = formattedTemplateAppointments;

            let carePlanMedicationsExists = carePlanMedications
                ? !carePlanMedications.length
                : !carePlanMedications; //true if doesnot exist
            let carePlanAppointmentsExists = carePlanAppointments
                ? !carePlanAppointments.length
                : !carePlanAppointments; //true if doesnot exist
            if (
                carePlanTemplateId &&
                carePlanMedicationsExists &&
                carePlanAppointmentsExists &&
                !shown
            ) {
                show = true;
            }

            console.log(
                "CARE PLAN OF PATIENTTTT===========>>>>>>>",
                patient_id,
                carePlanId,
                shown,
                carePlanMedications,
                carePlanAppointments,
                show,
                carePlanTemplateId,
                carePlanMedicationsExists,
                carePlanAppointmentsExists
            );
            if (shown == false) {
                let details = cPdetails;
                details.shown = true;
                let updatedCarePlan = await carePlanService.updateCarePlan(
                    {details},
                    carePlanId
                );
            }

            return this.raiseSuccess(
                res,
                200,
                {
                    care_plans: {...carePlanApiData},
                    show,
                    ...(permissions.includes(PERMISSIONS.MEDICATIONS.VIEW) && {medicationsOfTemplate}),
                    appointmentsOfTemplate,
                    carePlanMedications,
                    carePlanAppointments,
                    carePlanTemplateId,
                },
                "patient care plan details fetched successfully"
            );
        } catch (error) {
            console.log("GET PATIENT DETAILS ERROR --> ", error);
            return this.raiseServerError(res, 500, error);
        }
    };

    addProfile = async (req, res) => {
        const {raiseSuccess, raiseClientError, raiseServerError} = this;
        try {
            const {body: {user_role_id, care_plan_id} = {}} = req;

            const {userDetails} = req;
            const {userCategoryData: {basic_info: {id: doctorId} = {}} = {}} = userDetails || {};

            const carePlanId = care_plan_id;
            const dataToAdd = {
                care_plan_id,
                secondary_doctor_role_id: user_role_id
            };
            const existingMapping = await careplanSecondaryDoctorMappingService.getByData(dataToAdd) || null;

            if (!existingMapping) {
                const createdMapping = await careplanSecondaryDoctorMappingService.create(dataToAdd) || null;

                if (createdMapping) {
                    const carePlan = await CarePlanWrapper(null, care_plan_id);
                    const addUserToChat = await twilioService.addMember(carePlan.getChannelId(), user_role_id);


                    let carePlanAppointmentIds = await getCarePlanAppointmentIds(carePlanId);
                    let carePlanMedicationIds = await getCarePlanMedicationIds(carePlanId);
                    let carePlanSeverityDetails = await getCarePlanSeverityDetails(
                        carePlanId
                    );
                    const carePlanApiWrapper = await CarePlanWrapper(null, carePlanId);

                    let carePlanApiData = {};

                    const {vital_ids} = await carePlanApiWrapper.getAllInfo();
                    const {
                        doctors = {},
                        providers = {},
                        user_roles = {},
                        secondary_doctor_user_role_ids = []
                    } = await carePlan.getAllInfo();

                    carePlanApiData[carePlanApiWrapper.getCarePlanId()] = {
                        ...carePlanApiWrapper.getBasicInfo(),
                        ...carePlanSeverityDetails,
                        carePlanMedicationIds,
                        carePlanAppointmentIds,
                        vital_ids,
                        secondary_doctor_user_role_ids
                    };

                    // if(addUserToChat) {
                    //   return raiseSuccess(res, 200, {}, "Profile added successfully");
                    // } else {
                    //   await careplanSecondaryDoctorMappingService.delete(dataToAdd) || null;
                    // }
                    return raiseSuccess(res, 200, {
                        care_plans: {...carePlanApiData},
                        doctors,
                        providers,
                        user_roles
                    }, "Profile added successfully");
                } else {
                    return raiseClientError(res, 422, {}, "Please check details entered");
                }
            } else {
                return raiseClientError(res, 201, {}, "Profile already added in the treatment");
            }
        } catch (error) {
            Log.debug("addProfile 500 ERROR", error);
            return raiseServerError(res);
        }
    };
}

export default new CarePlanController();
