import Controller from "../";
import Log from "../../../libs/log";
import {CHART_DETAILS, CHART_LIMIT} from "../../../constant";

import userPreferenceService from "../../services/userPreferences/userPreference.service";

import UserPreferenceWrapper from "../../ApiWrapper/web/userPreference";

const Logger = new Log("WEB GRAPH CONTROLLER");

class GraphController extends Controller {
    constructor() {
        super();
    }

    getAllGraphs = async (req, res) => {
        const {raiseServerError, raiseSuccess} = this;
        try {
            const {userDetails: {userId} = {}} = req;

            const userPreferenceData = await userPreferenceService.getPreferenceByData({user_id: userId});
            Logger.debug("9182391283 userPreferenceData ---> ", userPreferenceData);
            const userPreference = await UserPreferenceWrapper(userPreferenceData);

            const charts = userPreference.getChartDetails();

            let chartData = {};
            charts.forEach(chart => {
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
            const {body: {chart_ids = []} = {}, userDetails: {userId} = {}} = req;
            console.log('CHART IDSSSSSSSSSSSSS==========================>',chart_ids);
            const userPreferenceData = await userPreferenceService.getPreferenceByData({user_id: userId});
            const userPreference = await UserPreferenceWrapper(userPreferenceData);

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

            let chartData = {};
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