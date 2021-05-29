import Logger from "../../../libs/log";

const Log = new Logger("EVENT HELPER");
import {EVENT_TYPE, USER_CATEGORY} from "../../../constant";

// services
import CarePlanService from "../../services/carePlan/carePlan.service";
import EventService from "../../services/scheduleEvents/scheduleEvent.service";
import doctorProviderMappingService from "../../services/doctorProviderMapping/doctorProviderMapping.service";
import patientService from "../../services/patients/patients.service";

// wrappers
import CarePlanWrapper from "../../ApiWrapper/web/carePlan";
import EventWrapper from "../../ApiWrapper/common/scheduleEvents";
import PatientWrapper from "../../ApiWrapper/web/patient";

export const doctorChart = async req => {
    try {
        const {userDetails: {userCategoryId: doctor_id} = {}} = req;
        Log.info(`DOCTOR ID (doctor_id) : ${doctor_id}`);


        return await getAllDataForDoctors(doctor_id);

    } catch (error) {
        Log.debug("doctorChart catch error", error);
        throw error;
    }
};

export const providerChart = async (req) => {
    try {
        const {userDetails: {userCategoryId: provider_id} = {}} = req;
        Log.info(`PROVIDER ID (provider_id) : ${provider_id}`);

        // get all doctors attached to provider
        const doctorData = await doctorProviderMappingService.getAllDoctorIds(provider_id) || [];

        Log.debug("doctorData", doctorData);
        const doctorIds = doctorData.map(data => data.doctor_id);
        Log.debug("doctorIds", doctorData);
        return await getAllDataForDoctors(doctorIds, USER_CATEGORY.PROVIDER);
    } catch (error) {
        throw error;
    }
};

// HELPERS
const getAllDataForDoctors = async (doctor_id, category = USER_CATEGORY.PROVIDER) => {
    try {
        Log.debug("doctor_id", doctor_id);
        const eventService = new EventService();
        // get all careplans(treatments) attached to doctor
        const carePlans =
            (await CarePlanService.getCarePlanByData({
                doctor_id
            })) || [];

        Log.debug("ALL CARE_PLANS", carePlans);

        let appointmentIds = [];
        let medicationIds = [];
        let vitalIds = [];

        // extract all event_ids from careplan attached to doctor
        for (let i = 0; i < carePlans.length; i++) {
            const carePlan = await CarePlanWrapper(carePlans[i]);
            const {
                appointment_ids,
                medication_ids,
                vital_ids
            } = await carePlan.getAllInfo();

            appointmentIds = [...appointmentIds, ...appointment_ids];
            medicationIds = [...medicationIds, ...medication_ids];
            vitalIds = [...vitalIds, ...vital_ids];
        }

        // fetch all schedule events in latest -> last order for each event_ids collected
        // missed range : 1 WEEK
        const scheduleEvents =
            (await eventService.getMissedByData({
                appointment_ids: appointmentIds,
                medication_ids: medicationIds,
                vital_ids: vitalIds
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

    let patientIds = [];

    for (let i = 0; i < events.length; i++) {
        const event = await EventWrapper(events[i]);
        const {
            start_time,
            end_time,
            details: {
                medicines,
                patient_id,
                medications: {participant_id} = {},
                vital_templates: {basic_info: {name: vital_name} = {}} = {},
                participant_one = {},
                participant_two = {}
            } = {},
            critical
        } = event.getAllInfo();

        switch (event.getEventType()) {
            case EVENT_TYPE.MEDICATION_REMINDER:
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
                    if(participant_one.category === USER_CATEGORY.PATIENT) {
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

        }
    }

    let patientData = {};

    if(patientIds.length > 0) {
        const allPatients = await patientService.getPatientByData({
            id: patientIds
        }) || [];

        for(let index = 0; index < allPatients.length; index++) {
            const patient = await PatientWrapper(allPatients[index]);
            patientData[patient.getPatientId()] = patient.getBasicInfo();
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

        // for provider related api call
        patients: {
            ...patientData
        }
    };
};
