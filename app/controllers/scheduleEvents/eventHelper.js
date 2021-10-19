import Logger from "../../../libs/log";

const Log = new Logger("EVENT HELPER");
import {EVENT_TYPE, USER_CATEGORY} from "../../../constant";

// services
import CarePlanService from "../../services/carePlan/carePlan.service";
import EventService from "../../services/scheduleEvents/scheduleEvent.service";
import doctorProviderMappingService from "../../services/doctorProviderMapping/doctorProviderMapping.service";
import patientService from "../../services/patients/patients.service";
import userRoleService from "../../services/userRoles/userRoles.service";
import doctorService from "../../services/doctor/doctor.service";
// wrappers
import CarePlanWrapper from "../../ApiWrapper/web/carePlan";
import EventWrapper from "../../ApiWrapper/common/scheduleEvents";
import PatientWrapper from "../../ApiWrapper/web/patient";
import DoctorWrapper from "../../ApiWrapper/web/doctor";
import UserRoleWrapper from "../../ApiWrapper/web/userRoles";
import DietWrapper from "../../ApiWrapper/web/diet";
import WorkoutWrppaer from "../../ApiWrapper/web/workouts";

export const doctorChart = async req => {
    try {
        const {userDetails: {userRoleId, userCategoryId: doctor_id} = {}} = req;
        Log.info(`DOCTOR ID (doctor_id) : ${doctor_id}`);

        return await getAllDataForDoctors({doctor_id, user_role_id: userRoleId});
    } catch (error) {
        Log.debug("doctorChart catch error", error);
        throw error;
    }
};

export const hspChart = async req => {
    try {
        const {userDetails: {userRoleId, userCategoryId: doctor_id} = {}} = req;
        Log.info(`DOCTOR ID (doctor_id) : ${doctor_id}`);


        return await getAllDataForDoctors({doctor_id, user_role_id: userRoleId, category: USER_CATEGORY.HSP});

    } catch (error) {
        Log.debug("doctorChart catch error", error);
        throw error;
    }
};

export const providerChart = async (req) => {
    try {
        const {userDetails: {userRoleId, userCategoryId: provider_id} = {}} = req;
        Log.info(`PROVIDER ID (provider_id) : ${provider_id}`);
        // get all doctors attached to provider
        // const doctorData = await doctorProviderMappingService.getAllDoctorIds(provider_id) || [];

        // Log.debug("doctorData", doctorData);
        // const doctorIds = doctorData.map(data => data.doctor_id);

        // Log.debug("doctorIds", doctorData);
        let allDoctorsData = {};

        const {count = 0, rows = []} = await userRoleService.findAndCountAll({
            where: {
                linked_id: provider_id
            },
            attributes: ['id']
        });

        if (count) {
            for (let each in rows) {
                const {id: user_role_id} = rows[each] || {};
                const [response, responseMessage] = await getAllDataForDoctors({
                    doctor_id: null,
                    doctorIds: [],
                    user_role_id,
                    category: USER_CATEGORY.PROVIDER
                });
                const {
                    missed_medications: p_missed_medications = {},
                    medication_ids: {
                        critical: p_medication_ids_critical = [],
                        non_critical: p_medication_ids_non_critical = []
                    } = {},
                    missed_appointments: p_missed_appointments = {},
                    appointment_ids: {
                        critical: p_appointment_ids_critical = [],
                        non_critical: p_appointment_ids_non_critical = []
                    } = {},
                    missed_vitals: p_missed_vitals = {},
                    vital_ids: {
                        critical: p_vital_ids_critical = [],
                        non_critical: p_vital_ids_non_critical = []
                    } = {},
                    missed_diets: p_missed_diets = {},
                    diet_ids: {
                        critical: p_diet_ids_critical = [],
                        non_critical: p_diet_ids_non_critical = []
                    } = {},
                    missed_workouts: p_missed_workouts = {},
                    workout_ids: {
                        critical: p_workout_ids_critical = [],
                        non_critical: p_workout_ids_non_critical = []
                    } = {},
                    patients: p_patients = {}
                } = response || {};

                const {
                    missed_medications = {},
                    medication_ids: {
                        critical: medication_ids_critical = [],
                        non_critical: medication_ids_non_critical = []
                    } = {},
                    missed_appointments = {},
                    appointment_ids: {
                        critical: appointment_ids_critical = [],
                        non_critical: appointment_ids_non_critical = []
                    } = {},
                    missed_vitals = {},
                    vital_ids: {
                        critical: vital_ids_critical = [],
                        non_critical: vital_ids_non_critical = []
                    } = {},
                    missed_diets = {},
                    diet_ids: {
                        critical: diet_ids_critical = [],
                        non_critical: diet_ids_non_critical = []
                    } = {},
                    missed_workouts = {},
                    workout_ids: {
                        critical: workout_ids_critical = [],
                        non_critical: workout_ids_non_critical = []
                    } = {},
                    patients = {}
                } = allDoctorsData || {};

                allDoctorsData = {
                    missed_medications: {...missed_medications, ...p_missed_medications},
                    missed_appointments: {...missed_appointments, ...p_missed_appointments},
                    missed_vitals: {...missed_vitals, ...p_missed_vitals},
                    missed_diets: {...missed_diets, ...p_missed_diets},
                    missed_workouts: {...missed_workouts, ...p_missed_workouts},

                    medication_ids: {
                        'critical': [...medication_ids_critical, ...p_medication_ids_critical],
                        'non_critical': [...medication_ids_non_critical, ...p_medication_ids_non_critical]
                    },
                    appointment_ids: {
                        'critical': [...appointment_ids_critical, ...p_appointment_ids_critical],
                        'non_critical': [...appointment_ids_non_critical, ...p_appointment_ids_non_critical]
                    },
                    vital_ids: {
                        'critical': [...vital_ids_critical, ...p_vital_ids_critical],
                        'non_critical': [...vital_ids_non_critical, ...p_vital_ids_non_critical]
                    },
                    diet_ids: {
                        'critical': [...diet_ids_critical, ...p_diet_ids_critical],
                        'non_critical': [...diet_ids_non_critical, ...p_diet_ids_non_critical]
                    },
                    workout_ids: {
                        'critical': [...workout_ids_critical, ...p_workout_ids_critical],
                        'non_critical': [...workout_ids_non_critical, ...p_workout_ids_non_critical]
                    },
                    patients: {...patients, ...p_patients}
                }

                console.log("32462374627427423", {user_role_id, allDoctorsData, response});

            }
        }

        return [
            {...allDoctorsData},
            "Missed events fetched successfully"
        ];
    } catch (error) {
        Log.debug("8234872364862 providerChart catch error", error);
        throw error;
    }
};

// HELPERS
const getAllDataForDoctors = async ({doctor_id, category = USER_CATEGORY.PROVIDER, user_role_id}) => {
    try {
        // Log.debug("doctor_id", doctor_id);
        Log.debug("user_role_id", user_role_id);
        const eventService = new EventService();
        // get all careplans(treatments) attached to doctor
        // const doctor = DoctorWrapper(null , doctor_id);
        // let userRoleId = null ;
        // const docorUserId = (await doctor).getUserId();
        // const UserRoleDataForUserId = await userRoleService.getFirstUserRole(docorUserId);
        // if(UserRoleDataForUserId){
        //     const userRoleWrapper = await UserRoleWrapper(UserRoleDataForUserId);
        //     userRoleId = userRoleWrapper.getId();
        // }
        const carePlans =
            (await CarePlanService.getCarePlanByData({
                user_role_id
            })) || [];

        // Log.debug("ALL CARE_PLANS", carePlans);

        let appointmentIds = [];
        let medicationIds = [];
        let vitalIds = [];
        let dietIds = [];
        let workoutIds = [];

        // extract all event_ids from careplan attached to doctor
        for (let i = 0; i < carePlans.length; i++) {
            const carePlan = await CarePlanWrapper(carePlans[i]);
            const {
                appointment_ids = [],
                medication_ids = [],
                vital_ids = [],
                diet_ids = [],
                workout_ids = []
            } = await carePlan.getAllInfo();

            appointmentIds = [...appointmentIds, ...appointment_ids];
            medicationIds = [...medicationIds, ...medication_ids];
            vitalIds = [...vitalIds, ...vital_ids];
            dietIds = [...dietIds, ...diet_ids];
            workoutIds = [...workoutIds, ...workout_ids];
        }

        // fetch all schedule events in latest -> last order for each event_ids collected
        // missed range : 1 WEEK
        const scheduleEvents =
            (await eventService.getMissedByData({
                appointment_ids: appointmentIds,
                medication_ids: medicationIds,
                vital_ids: vitalIds,
                diet_ids: dietIds,
                workout_ids: workoutIds
            })) || [];

        return [
            {...(await getFormattedData(scheduleEvents, category))},
            "Missed events fetched successfully"
        ];
    } catch (error) {
        Log.debug("getAllDataForDoctors catch error", error);
        throw error;
    }
};


const getFormattedData = async (events = [], category = USER_CATEGORY.DOCTOR) => {
    /*
     *
     * separate schedule_event data into :: appointments | medications | vitals
     * further separate it into :: critical | non-critical
     *
     * ex., for medications....
     * missed_medications: {
     *   [event_id]: {
     *       [date]: [
     *          {schedule_event_data_1},
     *          {schedule_event_data_2},
     *       ]
     *       ...
     *   },
     *   ...
     * },
     * medication_ids: {
     *   critical: [...],
     *   non_critical: [...]
     * },
     * .... // for appointments & vitals
     *
     * */

    let medications = {};
    let medication_critical_ids = [];
    let medication_non_critical_ids = [];

    let appointments = {};
    let appointment_critical_ids = [];
    let appointment_non_critical_ids = [];

    let vitals = {};
    let vital_critical_ids = [];
    let vital_non_critical_ids = [];

    let diets = {};
    let diet_critical_ids = [];
    let diet_non_critical_ids = [];

    let workouts = {};
    let workout_critical_ids = [];
    let workout_non_critical_ids = [];

    let patientIds = [];

    for (let i = 0; i < events.length; i++) {
        const event = await EventWrapper(events[i]);
        const {
            start_time,
            end_time,
            details,
            details: {
                medicines,
                patient_id,
                medications: {participant_id} = {},
                vital_templates: {basic_info: {name: vital_name} = {}} = {},
                participant_one = {},
                participant_two = {},
                diets: event_diets = {},
                workouts: event_workouts = {},
                workout_id = null,
                diet_id = null,
            } = {},
            critical
        } = event.getAllInfo();

        switch (event.getEventType()) {
            case EVENT_TYPE.MEDICATION_REMINDER:
                if (category === USER_CATEGORY.HSP) {
                    continue;
                }

                if (!(event.getEventId() in medications)) {
                    if (category === USER_CATEGORY.PROVIDER) {
                        patientIds.push(participant_id);
                    }
                    const timings = {};
                    timings[event.getDate()] = [];
                    timings[event.getDate()].push({start_time, end_time});
                    medications[event.getEventId()] = {medicines, critical, participant_id, timings};
                } else {
                    const {timings} = medications[event.getEventId()] || {};
                    if (!Object.keys(timings).includes(event.getDate())) {
                        timings[event.getDate()] = [];
                    }
                    timings[event.getDate()].push({start_time, end_time});
                    medications[event.getEventId()] = {...medications[event.getEventId()], timings};
                }

                // critical | non_critical
                if (event.getCriticalValue()) {
                    /*
                     * to avoid duplicate entry. can also use if condition
                     * if(medication_critical_ids.indexOf(event.getEventId()) === -1) {
                     *     medication_critical_ids.push(event.getEventId());
                     * }
                     * ...
                     * */
                    medication_critical_ids.indexOf(event.getEventId()) === -1
                        ? medication_critical_ids.push(event.getEventId())
                        : null;
                } else {
                    medication_non_critical_ids.indexOf(event.getEventId()) === -1
                        ? medication_non_critical_ids.push(event.getEventId())
                        : null;
                }
                break;

            case EVENT_TYPE.APPOINTMENT:
                if (category === USER_CATEGORY.PROVIDER) {
                    if (participant_one.category === USER_CATEGORY.PATIENT) {
                        patientIds.push(participant_one.id);
                    } else {
                        patientIds.push(participant_two.id);
                    }
                }
                if (!(event.getEventId() in appointments)) {
                    appointments[event.getEventId()] = [];
                    appointments[event.getEventId()].push(event.getAllInfo());
                } else {
                    appointments[event.getEventId()].push(event.getAllInfo());
                }

                // critical | non_critical
                if (event.getCriticalValue()) {
                    appointment_critical_ids.indexOf(event.getEventId()) === -1
                        ? appointment_critical_ids.push(event.getEventId())
                        : null;
                } else {
                    appointment_non_critical_ids.indexOf(event.getEventId()) === -1
                        ? appointment_non_critical_ids.push(event.getEventId())
                        : null;
                }
                break;
            case EVENT_TYPE.VITALS:
                if (category === USER_CATEGORY.PROVIDER) {
                    patientIds.push(patient_id);
                }

                if (!(event.getEventId() in vitals)) {
                    const timings = {};
                    timings[event.getDate()] = [];
                    timings[event.getDate()].push({start_time, end_time});
                    vitals[event.getEventId()] = {patient_id, critical, vital_name, timings};
                } else {
                    const {timings = {}} = vitals[event.getEventId()] || {};
                    if (!Object.keys(timings).includes(event.getDate())) {
                        timings[event.getDate()] = [];
                    }
                    timings[event.getDate()].push({start_time, end_time});
                    vitals[event.getEventId()] = {...vitals[event.getEventId()], timings};
                }

                // if (!(event.getEventId() in vitals)) {
                //     vitals[event.getEventId()] = [];
                //     vitals[event.getEventId()].push(event.getAllInfo());
                // } else {
                //     vitals[event.getEventId()].push(event.getAllInfo());
                // }

                // critical | non_critical
                if (event.getCriticalValue()) {
                    vital_critical_ids.indexOf(event.getEventId()) === -1
                        ? vital_critical_ids.push(event.getEventId())
                        : null;
                } else {
                    vital_non_critical_ids.indexOf(event.getEventId()) === -1
                        ? vital_non_critical_ids.push(event.getEventId())
                        : null;
                }
                break;

            case EVENT_TYPE.DIET:
                const dietWrapper = await DietWrapper({id: diet_id});
                const careplan_id = await dietWrapper.getCareplanId();
                const careplanWrapper = await CarePlanWrapper(null, careplan_id);
                const patientId = await careplanWrapper.getPatientId();

                const {basic_info: {name: diet_name = ''} = {}} = event_diets[diet_id] || {};
                if (!(event.getEventId() in diets)) {
                    if (category === USER_CATEGORY.PROVIDER) {
                        patientIds.push(patientId);
                    }
                    const timings = {};
                    timings[event.getDate()] = [];
                    timings[event.getDate()].push({start_time, end_time});
                    diets[event.getEventId()] = {diet_name, participant_id: patientId, timings, critical};
                } else {
                    const {timings} = diets[event.getEventId()] || {};
                    if (!Object.keys(timings).includes(event.getDate())) {
                        timings[event.getDate()] = [];
                    }
                    timings[event.getDate()].push({start_time, end_time});
                    diets[event.getEventId()] = {...diets[event.getEventId()], timings};
                }

                // critical | non_critical
                if (event.getCriticalValue()) {
                    diet_critical_ids.indexOf(event.getEventId()) === -1
                        ? diet_critical_ids.push(event.getEventId())
                        : null;
                } else {
                    diet_non_critical_ids.indexOf(event.getEventId()) === -1
                        ? diet_non_critical_ids.push(event.getEventId())
                        : null;
                }
                break;

            case EVENT_TYPE.WORKOUT:
                const workoutWrapper = await WorkoutWrppaer({id: workout_id});
                const workout_careplan_id = await workoutWrapper.getCareplanId();
                const workoutCareplanWrapper = await CarePlanWrapper(null, workout_careplan_id);
                const workoutPatientId = await workoutCareplanWrapper.getPatientId();

                const {basic_info: {name: workout_name = ''} = {}} = event_workouts[workout_id] || {};
                if (!(event.getEventId() in workouts)) {
                    if (category === USER_CATEGORY.PROVIDER) {
                        patientIds.push(workoutPatientId);
                    }
                    const timings = {};
                    timings[event.getDate()] = [];
                    timings[event.getDate()].push({start_time, end_time});
                    workouts[event.getEventId()] = {workout_name, participant_id: workoutPatientId, timings, critical};
                } else {
                    const {timings} = workouts[event.getEventId()] || {};
                    if (!Object.keys(timings).includes(event.getDate())) {
                        timings[event.getDate()] = [];
                    }
                    timings[event.getDate()].push({start_time, end_time});
                    workouts[event.getEventId()] = {...workouts[event.getEventId()], timings};
                }

                // critical | non_critical
                if (event.getCriticalValue()) {
                    workout_critical_ids.indexOf(event.getEventId()) === -1
                        ? workout_critical_ids.push(event.getEventId())
                        : null;
                } else {
                    workout_non_critical_ids.indexOf(event.getEventId()) === -1
                        ? workout_non_critical_ids.push(event.getEventId())
                        : null;
                }
                break;
        }
    }

    let patientData = {};

    if (patientIds.length > 0) {
        const allPatients = await patientService.getPatientByData({
            id: patientIds
        }) || [];

        for (let index = 0; index < allPatients.length; index++) {
            const patient = await PatientWrapper(allPatients[index]);
            const {user_role_id = null, care_plan_id = null} = await patient.getAllInfo();
            patientData[patient.getPatientId()] = {...patient.getBasicInfo(), user_role_id, care_plan_id}

        }
    }

    return {
        // medications
        missed_medications: medications,
        medication_ids: {
            critical: medication_critical_ids,
            non_critical: medication_non_critical_ids,
        },

        // appointments
        missed_appointments: appointments,
        appointment_ids: {
            critical: appointment_critical_ids,
            non_critical: appointment_non_critical_ids,
        },

        // actions (vitals)
        missed_vitals: vitals,
        vital_ids: {
            critical: vital_critical_ids,
            non_critical: vital_non_critical_ids,
        },

        // diets
        missed_diets: diets,
        diet_ids: {
            critical: diet_critical_ids,
            non_critical: diet_non_critical_ids,
        },

        // actions (vitals)
        missed_workouts: workouts,
        workout_ids: {
            critical: workout_critical_ids,
            non_critical: workout_non_critical_ids,
        },

        // for provider related api call
        patients: {
            ...patientData
        }
    };
};
