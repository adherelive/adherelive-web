import Controller from "../../index";
import { createLogger } from "../../../../libs/logger";
import { CHART_DETAILS, NO_ACTION, NO_APPOINTMENT, NO_DIET, NO_MEDICATION, NO_WORKOUT, } from "../../../../constant";

import userPreferenceService from "../../../services/userPreferences/userPreference.service";

import UserPreferenceWrapper from "../../../apiWrapper/mobile/userPreference";

const logger = createLogger("WEB GRAPH CONTROLLER");

class GraphController extends Controller {
  constructor() {
    super();
  }

  getAllGraphs = async (req, res) => {
    const { raiseServerError, raiseClientError, raiseSuccess } = this;
    try {
      // const {userDetails: {userId} = {}} = req;
      const { userDetails: { userRoleId } = {} } = req;

      const userPreference =
        (await userPreferenceService.findOne({
          where: {
            user_role_id: userRoleId,
          },
        })) || null;

      let chartData = {};

      if (userPreference) {
        const userPreferenceWrapper = await UserPreferenceWrapper(
          userPreference
        );
        const charts = userPreferenceWrapper.getChartDetails() || [];

        charts.forEach((chart) => {
          chartData[chart] = { ...CHART_DETAILS[chart] };
        });

        return raiseSuccess(
          res,
          200,
          {
            user_preferences: {
              ...userPreferenceWrapper.getChartInfo(),
            },
            charts: {
              ...chartData,
            },
          },
          "Charts fetched successfully"
        );
      } else {
        return raiseClientError(
          res,
          422,
          {},
          "Incorrect user for preference request"
        );
      }

      // const userPreferenceData = await userPreferenceService.getPreferenceByData({user_id: userId});
      // logger.debug("9182391283 userPreferenceData ---> ", userPreferenceData);
      // // const userPreference = await UserPreferenceWrapper(userPreferenceData);

      // // const charts = userPreference.getChartDetails();

      // let chartData = {};

      // let  CHART_DETAILS = {
      //     [NO_MEDICATION]: {
      //       type: "no_medication",
      //       name: "Missed Medication",
      //     },
      //     [NO_APPOINTMENT]: {
      //       type: "no_appointment",
      //       name: "Missed Appointment",
      //     },
      //     [NO_ACTION]: {
      //       type: "no_action",
      //       name: "Missed Action",
      //     }
      //   };

      // charts.forEach(chart => {
      //     logger.debug("324564322456432678786745643",CHART_DETAILS[chart]);
      //    chartData[chart] = CHART_DETAILS[chart];
      // });
    } catch (error) {
      logger.error("getAllGraphs 500 error", error);
      return raiseServerError(res);
    }
  };

  addGraphType = async (req, res) => {
    const { raiseServerError, raiseSuccess } = this;
    try {
      const { body: { chart_ids = [] } = {} } = req;
      const { body, userDetails } = req;
      const {
        userId,
        userRoleId,
        userData: { category } = {},
        userCategoryData: { basic_info: { id: doctorId } = {} } = {},
      } = userDetails || {};
      const userPreferenceData =
        await userPreferenceService.getPreferenceByData({
          user_role_id: userRoleId,
        });
      const userPreference = await UserPreferenceWrapper(userPreferenceData);

      let chartData = {};

      let CHART_DETAILS = {
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
        },
        [NO_DIET]: {
          type: "no_diet",
          name: "Missed Diet",
        },
        [NO_WORKOUT]: {
          type: "no_workout",
          name: "Missed Workout",
        },
      };

      // logger.debug("userPreference.getChartDetails().includes(id) ", userPreference.getChartDetails().includes(id));

      // userPreference.getChartDetails().forEach(id => {
      //     if(chart_ids.includes(id)) {
      //         return this.raiseClientError(res, 422, {}, "Chart Type already added");
      //     }
      // });

      const updatedChart = [
        // ...userPreference.getChartDetails(),
        ...chart_ids,
      ];

      const updatedDetails = {
        ...userPreference.getAllDetails(),
        charts: updatedChart,
      };

      const updateUserPreference =
        await userPreferenceService.updateUserPreferenceData(
          {
            details: updatedDetails,
          },
          userPreference.getUserPreferenceId()
        );

      const updatedUserPreference = await UserPreferenceWrapper(
        null,
        userPreference.getUserPreferenceId()
      );

      updatedChart.forEach((chart) => {
        chartData[chart] = CHART_DETAILS[chart];
      });

      return raiseSuccess(
        res,
        200,
        {
          user_preferences: {
            ...updatedUserPreference.getChartInfo(),
          },
          charts: {
            ...chartData,
          },
        },
        "Charts added successfully"
      );
    } catch (error) {
      logger.error("getAllGraphs 500 error ---> ", error);
      return raiseServerError(res);
    }
  };
}

export default new GraphController();
