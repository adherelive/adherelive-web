import Controller from "../../";
import Log from "../../../../libs/log";
import {CHART_DETAILS, CHART_LIMIT} from "../../../../constant";

import userPreferenceService from "../../../services/userPreferences/userPreference.service";

import UserPreferenceWrapper from "../../../ApiWrapper/mobile/userPreference";

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
 


            let  CHART_DETAILS = {
                [NO_MEDICATION]: {
                  type: "no_medication",
                  name: "Missed Medication",
                },
                [NO_APPOINTMENT]: {
                  type: "no_appointment",
                  name: "Missed Appointment",
                },
                [NO_ACTION]: {
                  type: "no_action",
                  name: "Missed Action",
                }
              };
            



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
            


            let  CHART_DETAILS = {
                [NO_MEDICATION]: {
                  type: "no_medication",
                  name: "Missed Medication",
                },
                [NO_APPOINTMENT]: {
                  type: "no_appointment",
                  name: "Missed Appointment",
                },
                [NO_ACTION]: {
                  type: "no_action",
                  name: "Missed Action",
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