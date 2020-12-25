import Controller from "../";
import Log from "../../../libs/log";
import {
    // CHART_DETAILS, 
    NO_MEDICATION,
    NO_APPOINTMENT,
    NO_ACTION,
    CHART_LIMIT} from "../../../constant";
import {DAYS, EVENT_TYPE,EVENT_STATUS, FEATURE_TYPE, USER_CATEGORY} from "../../../constant";

import userPreferenceService from "../../services/userPreferences/userPreference.service";
import ScheduleEventService from "../../services/scheduleEvents/scheduleEvent.service";
import carePlanService from "../../services/carePlan/carePlan.service";

import UserPreferenceWrapper from "../../ApiWrapper/web/userPreference";

import CarePlanWrapper from "../../ApiWrapper/web/carePlan";
import eventService from "../../services/scheduleEvents/scheduleEvent.service";
import EventWrapper from "../../ApiWrapper/common/scheduleEvents";

const Logger = new Log("WEB GRAPH CONTROLLER");

class GraphController extends Controller {
    constructor() {
        super();
    }

    getAllGraphs = async (req, res) => {
        const {raiseServerError, raiseSuccess} = this;
        try {
            // const {userDetails: {userId} = {}} = req;
            const { body, userDetails } = req;
            const { userId, userData: { category  } = {} ,userCategoryData : { basic_info: { id :doctorId } ={} } = {} } = userDetails || {};


            const userPreferenceData = await userPreferenceService.getPreferenceByData({user_id: userId});
            Logger.debug("9182391283 userPreferenceData ---> ", userPreferenceData);
            const userPreference = await UserPreferenceWrapper(userPreferenceData);

            const charts = userPreference.getChartDetails();

            let chartData = {};
            let docAllCareplanData = [];
            let vitalApiData = {};
            let criticalVitalEventIds = [];
            let nonCriticalVitalEventIds = [];
            let medicationApiData = {};
            let criticalMedicationEventIds = [];
            let nonCriticalMedicationEventIds = [];
            let appointmentApiData = {};
            let criticalAppointmentEventIds = [];
            let nonCriticalAppointmentEventIds = [];
            const scheduleEventService = new ScheduleEventService();
      
            

             //// --------------------------------
           
                  docAllCareplanData = await carePlanService.getCarePlanByData({
                    doctor_id: doctorId
                  });

                for(let carePlan of docAllCareplanData) {
                    const carePlanApiWrapper = await CarePlanWrapper(carePlan);
                    const {vital_ids} = await carePlanApiWrapper.getAllInfo();
            
            
                    for(let vId of vital_ids){
            
                        let expiredVitalsList = await scheduleEventService.getAllEventByData({
                          event_type: EVENT_TYPE.VITALS,
                          status: EVENT_STATUS.EXPIRED,
                          event_id:vId
                        });
            
            
                        for(let vital of expiredVitalsList ){
                          const vitalEventWrapper = await EventWrapper(vital);
                          // Logger.debug("8976756576890",vitalEventWrapper);
                         
                            if (vitalEventWrapper.getCriticalValue()) {
                              if (
                                !criticalVitalEventIds.includes(
                                  vitalEventWrapper.getEventId()
                                )
                              ) {
                                criticalVitalEventIds.push(
                                  vitalEventWrapper.getEventId()
                                );
                              }
                            } else {
                              if (
                                !nonCriticalVitalEventIds.includes(
                                  vitalEventWrapper.getEventId()
                                )
                              ) {
                                nonCriticalVitalEventIds.push(
                                  vitalEventWrapper.getEventId()
                                );
                              }
                            }
                
                            vitalApiData[
                              vitalEventWrapper.getEventId()
                            ] = vitalEventWrapper.getDetails();
                          
                        };
            
            
                    };
                };

                for(let carePlan of docAllCareplanData) {
                    const carePlanApiWrapper = await CarePlanWrapper(carePlan);
                    const {medication_ids} = await carePlanApiWrapper.getAllInfo();
            
            
                    for(let mId of medication_ids){
            
                        let expiredMedicationsList = await scheduleEventService.getAllEventByData({
                          event_type: EVENT_TYPE.MEDICATION_REMINDER,
                          status: EVENT_STATUS.EXPIRED,
                          event_id:mId
                        });
            
            
                        for(let medication of expiredMedicationsList ){
                          const medicationEventWrapper = await EventWrapper(medication);
                         
                            if (medicationEventWrapper.getCriticalValue()) {
                              if (
                                !criticalMedicationEventIds.includes(
                                  medicationEventWrapper.getEventId()
                                )
                              ) {
                                criticalMedicationEventIds.push(
                                  medicationEventWrapper.getEventId()
                                );
                              }
                            } else {
                              if (
                                !nonCriticalMedicationEventIds.includes(
                                  medicationEventWrapper.getEventId()
                                )
                              ) {
                                nonCriticalMedicationEventIds.push(
                                  medicationEventWrapper.getEventId()
                                );
                              }
                            }
                
                            medicationApiData[
                              medicationEventWrapper.getEventId()
                            ] = medicationEventWrapper.getDetails();
                          
                        };
            
            
                    };
                };


                for(let carePlan of docAllCareplanData) {
                    const carePlanApiWrapper = await CarePlanWrapper(carePlan);
                    const {appointment_ids} = await carePlanApiWrapper.getAllInfo();
            
            
                    for(let aId of appointment_ids){
            
                        let expiredAppointmentsList = await scheduleEventService.getAllEventByData({
                          event_type: EVENT_TYPE.APPOINTMENT,
                          status: EVENT_STATUS.EXPIRED,
                          event_id:aId
                        });
            
            
                        for(let appointment of expiredAppointmentsList ){
                          const appointmentEventWrapper = await EventWrapper(appointment);
                         
                            if (appointmentEventWrapper.getCriticalValue()) {
                              if (
                                !criticalAppointmentEventIds.includes(
                                  appointmentEventWrapper.getEventId()
                                )
                              ) {
                                criticalAppointmentEventIds.push(
                                  appointmentEventWrapper.getEventId()
                                );
                              }
                            } else {
                              if (
                                !nonCriticalAppointmentEventIds.includes(
                                  appointmentEventWrapper.getEventId()
                                )
                              ) {
                                nonCriticalAppointmentEventIds.push(
                                  appointmentEventWrapper.getEventId()
                                );
                              }
                            }
                
                            appointmentApiData[
                              appointmentEventWrapper.getEventId()
                            ] = appointmentEventWrapper.getDetails();
                          
                        };
            
            
                        for(let carePlan of docAllCareplanData) {
                            const carePlanApiWrapper = await CarePlanWrapper(carePlan);
                            const {appointment_ids} = await carePlanApiWrapper.getAllInfo();
                    
                    
                            for(let aId of appointment_ids){
                    
                                let expiredAppointmentsList = await scheduleEventService.getAllEventByData({
                                  event_type: EVENT_TYPE.APPOINTMENT,
                                  status: EVENT_STATUS.EXPIRED,
                                  event_id:aId
                                });
                    
                    
                                for(let appointment of expiredAppointmentsList ){
                                  const appointmentEventWrapper = await EventWrapper(appointment);
                                 
                                    if (appointmentEventWrapper.getCriticalValue()) {
                                      if (
                                        !criticalAppointmentEventIds.includes(
                                          appointmentEventWrapper.getEventId()
                                        )
                                      ) {
                                        criticalAppointmentEventIds.push(
                                          appointmentEventWrapper.getEventId()
                                        );
                                      }
                                    } else {
                                      if (
                                        !nonCriticalAppointmentEventIds.includes(
                                          appointmentEventWrapper.getEventId()
                                        )
                                      ) {
                                        nonCriticalAppointmentEventIds.push(
                                          appointmentEventWrapper.getEventId()
                                        );
                                      }
                                    }
                        
                                    appointmentApiData[
                                      appointmentEventWrapper.getEventId()
                                    ] = appointmentEventWrapper.getDetails();
                                  
                                };
                    
                    
                            };
                        };    };
                };



            let  CHART_DETAILS = {
                [NO_MEDICATION]: {
                  type: "no_medication",
                  name: "Missed Medication",
                  critical: criticalMedicationEventIds.length,
                  total: criticalMedicationEventIds.length+nonCriticalMedicationEventIds.length
                },
                [NO_APPOINTMENT]: {
                  type: "no_appointment",
                  name: "Missed Appointment",
                  critical: criticalAppointmentEventIds.length,
                  total: criticalAppointmentEventIds.length+nonCriticalAppointmentEventIds.length
                },
                [NO_ACTION]: {
                  type: "no_action",
                  name: "Missed Action",
                  critical:criticalVitalEventIds.length,
                  total: criticalVitalEventIds.length+nonCriticalVitalEventIds.length
                }
              };
            

             /////// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>


            charts.forEach(chart => {
                Logger.debug("324564322456432678786745643",CHART_DETAILS[chart]);
               chartData[chart] = CHART_DETAILS[chart];
            });

            return raiseSuccess(res, 200, {
                user_preferences: {
                    ...userPreference.getChartInfo()
                },
                charts: {
                    ...chartData
                }
            },
                "Charts fetched successfully"
            );
        } catch(error) {
            Logger.debug("getAllGraphs 500 error ---> ", error);
            return raiseServerError(res);
        }
    };

    addGraphType = async (req, res) => {
        const {raiseServerError, raiseSuccess} = this;
        try {
            // const {params: {id} = {}, userDetails: {userId} = {}} = req;
            const {body: {chart_ids = []} = {}} = req;
            const { body, userDetails } = req;
            const { userId, userData: { category  } = {} ,userCategoryData : { basic_info: { id :doctorId } ={} } = {} } = userDetails || {};
            // console.log('CHART IDSSSSSSSSSSSSS==========================>',chart_ids);
            const userPreferenceData = await userPreferenceService.getPreferenceByData({user_id: userId});
            const userPreference = await UserPreferenceWrapper(userPreferenceData);

            let chartData = {};
            let docAllCareplanData = [];
            let vitalApiData = {};
            let criticalVitalEventIds = [];
            let nonCriticalVitalEventIds = [];
            let medicationApiData = {};
            let criticalMedicationEventIds = [];
            let nonCriticalMedicationEventIds = [];
            let appointmentApiData = {};
            let criticalAppointmentEventIds = [];
            let nonCriticalAppointmentEventIds = [];
            const scheduleEventService = new ScheduleEventService();
      
            

             //// --------------------------------
           
                  docAllCareplanData = await carePlanService.getCarePlanByData({
                    doctor_id: doctorId
                  });

                for(let carePlan of docAllCareplanData) {
                    const carePlanApiWrapper = await CarePlanWrapper(carePlan);
                    const {vital_ids} = await carePlanApiWrapper.getAllInfo();
            
            
                    for(let vId of vital_ids){
            
                        let expiredVitalsList = await scheduleEventService.getAllEventByData({
                          event_type: EVENT_TYPE.VITALS,
                          status: EVENT_STATUS.EXPIRED,
                          event_id:vId
                        });
            
            
                        for(let vital of expiredVitalsList ){
                          const vitalEventWrapper = await EventWrapper(vital);
                          // Logger.debug("8976756576890",vitalEventWrapper);
                         
                            if (vitalEventWrapper.getCriticalValue()) {
                              if (
                                !criticalVitalEventIds.includes(
                                  vitalEventWrapper.getEventId()
                                )
                              ) {
                                criticalVitalEventIds.push(
                                  vitalEventWrapper.getEventId()
                                );
                              }
                            } else {
                              if (
                                !nonCriticalVitalEventIds.includes(
                                  vitalEventWrapper.getEventId()
                                )
                              ) {
                                nonCriticalVitalEventIds.push(
                                  vitalEventWrapper.getEventId()
                                );
                              }
                            }
                
                            vitalApiData[
                              vitalEventWrapper.getEventId()
                            ] = vitalEventWrapper.getDetails();
                          
                        };
            
            
                    };
                };

                for(let carePlan of docAllCareplanData) {
                    const carePlanApiWrapper = await CarePlanWrapper(carePlan);
                    const {medication_ids} = await carePlanApiWrapper.getAllInfo();
            
            
                    for(let mId of medication_ids){
            
                        let expiredMedicationsList = await scheduleEventService.getAllEventByData({
                          event_type: EVENT_TYPE.MEDICATION_REMINDER,
                          status: EVENT_STATUS.EXPIRED,
                          event_id:mId
                        });
            
            
                        for(let medication of expiredMedicationsList ){
                          const medicationEventWrapper = await EventWrapper(medication);
                         
                            if (medicationEventWrapper.getCriticalValue()) {
                              if (
                                !criticalMedicationEventIds.includes(
                                  medicationEventWrapper.getEventId()
                                )
                              ) {
                                criticalMedicationEventIds.push(
                                  medicationEventWrapper.getEventId()
                                );
                              }
                            } else {
                              if (
                                !nonCriticalMedicationEventIds.includes(
                                  medicationEventWrapper.getEventId()
                                )
                              ) {
                                nonCriticalMedicationEventIds.push(
                                  medicationEventWrapper.getEventId()
                                );
                              }
                            }
                
                            medicationApiData[
                              medicationEventWrapper.getEventId()
                            ] = medicationEventWrapper.getDetails();
                          
                        };
            
            
                    };
                };


                for(let carePlan of docAllCareplanData) {
                    const carePlanApiWrapper = await CarePlanWrapper(carePlan);
                    const {appointment_ids} = await carePlanApiWrapper.getAllInfo();
            
            
                    for(let aId of appointment_ids){
            
                        let expiredAppointmentsList = await scheduleEventService.getAllEventByData({
                          event_type: EVENT_TYPE.APPOINTMENT,
                          status: EVENT_STATUS.EXPIRED,
                          event_id:aId
                        });
            
            
                        for(let appointment of expiredAppointmentsList ){
                          const appointmentEventWrapper = await EventWrapper(appointment);
                         
                            if (appointmentEventWrapper.getCriticalValue()) {
                              if (
                                !criticalAppointmentEventIds.includes(
                                  appointmentEventWrapper.getEventId()
                                )
                              ) {
                                criticalAppointmentEventIds.push(
                                  appointmentEventWrapper.getEventId()
                                );
                              }
                            } else {
                              if (
                                !nonCriticalAppointmentEventIds.includes(
                                  appointmentEventWrapper.getEventId()
                                )
                              ) {
                                nonCriticalAppointmentEventIds.push(
                                  appointmentEventWrapper.getEventId()
                                );
                              }
                            }
                
                            appointmentApiData[
                              appointmentEventWrapper.getEventId()
                            ] = appointmentEventWrapper.getDetails();
                          
                        };
            
            
                        for(let carePlan of docAllCareplanData) {
                            const carePlanApiWrapper = await CarePlanWrapper(carePlan);
                            const {appointment_ids} = await carePlanApiWrapper.getAllInfo();
                    
                    
                            for(let aId of appointment_ids){
                    
                                let expiredAppointmentsList = await scheduleEventService.getAllEventByData({
                                  event_type: EVENT_TYPE.APPOINTMENT,
                                  status: EVENT_STATUS.EXPIRED,
                                  event_id:aId
                                });
                    
                    
                                for(let appointment of expiredAppointmentsList ){
                                  const appointmentEventWrapper = await EventWrapper(appointment);
                                 
                                    if (appointmentEventWrapper.getCriticalValue()) {
                                      if (
                                        !criticalAppointmentEventIds.includes(
                                          appointmentEventWrapper.getEventId()
                                        )
                                      ) {
                                        criticalAppointmentEventIds.push(
                                          appointmentEventWrapper.getEventId()
                                        );
                                      }
                                    } else {
                                      if (
                                        !nonCriticalAppointmentEventIds.includes(
                                          appointmentEventWrapper.getEventId()
                                        )
                                      ) {
                                        nonCriticalAppointmentEventIds.push(
                                          appointmentEventWrapper.getEventId()
                                        );
                                      }
                                    }
                        
                                    appointmentApiData[
                                      appointmentEventWrapper.getEventId()
                                    ] = appointmentEventWrapper.getDetails();
                                  
                                };
                    
                    
                            };
                        };    };
                };



            let  CHART_DETAILS = {
                [NO_MEDICATION]: {
                  type: "no_medication",
                  name: "Missed Medication",
                  critical: criticalMedicationEventIds.length,
                  total: criticalMedicationEventIds.length+nonCriticalMedicationEventIds.length
                },
                [NO_APPOINTMENT]: {
                  type: "no_appointment",
                  name: "Missed Appointment",
                  critical: criticalAppointmentEventIds.length,
                  total: criticalAppointmentEventIds.length+nonCriticalAppointmentEventIds.length
                },
                [NO_ACTION]: {
                  type: "no_action",
                  name: "Missed Action",
                  critical:criticalVitalEventIds.length,
                  total: criticalVitalEventIds.length+nonCriticalVitalEventIds.length
                }
              };
            


            // Logger.debug("userPreference.getChartDetails().includes(id) ", userPreference.getChartDetails().includes(id));

            // userPreference.getChartDetails().forEach(id => {
            //     if(chart_ids.includes(id)) {
            //         return this.raiseClientError(res, 422, {}, "Chart Type already added");
            //     }
            // });

            const updatedChart = [
                // ...userPreference.getChartDetails(),
                ...chart_ids
            ];

            const updatedDetails = {
                ...userPreference.getAllDetails(),
                charts: updatedChart
            };

            const updateUserPreference = await userPreferenceService.updateUserPreferenceData({
                details: updatedDetails
            }, userPreference.getUserPreferenceId());

            const updatedUserPreference = await UserPreferenceWrapper(null, userPreference.getUserPreferenceId());

            updatedChart.forEach(chart => {
                chartData[chart] = CHART_DETAILS[chart];
            });

            return raiseSuccess(res, 200, {
                user_preferences: {
                    ...updatedUserPreference.getChartInfo()
                },
                    charts: {
                        ...chartData
                    }
            },
                "Charts added successfully");
        } catch(error) {
            Logger.debug("getAllGraphs 500 error ---> ", error);
            return raiseServerError(res);
        }
    };
}

export default new GraphController();