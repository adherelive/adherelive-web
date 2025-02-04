import Controller from "../index";

import { createLogger } from "../../../libs/logger";
import {
  CHART_DETAILS,
  NO_ACTION,
  NO_APPOINTMENT,
  NO_DIET,
  NO_MEDICATION,
  NO_WORKOUT,
  USER_CATEGORY,
} from "../../../constant";

import userPreferenceService from "../../services/userPreferences/userPreference.service";
import ProviderService from "../../services/provider/provider.service";

import UserPreferenceWrapper from "../../apiWrapper/web/userPreference";
import ProviderWrapper from "../../apiWrapper/web/provider";
import userRolesService from "../../services/userRoles/userRoles.service";

const logger = createLogger("WEB GRAPH CONTROLLER");

class GraphController extends Controller {
  constructor() {
    super();
  }

  /**
   * Generates and sends the data required to create the Charts on the main Dashboard of the Doctor.
   *
   * @param req
   * @param res
   * @returns {Promise<*>}
   */
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

      /**
       * TODO: Check why the following has been commented out?
      const userPreferenceData = await userPreferenceService.getPreferenceByData({user_id: userId});
      logger.debug("userPreferenceData in getAllGraphs: ", userPreferenceData);
      // const userPreference = await UserPreferenceWrapper(userPreferenceData);

      // const charts = userPreference.getChartDetails();

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
          logger.debug("Chart details for each chart: ",CHART_DETAILS[chart]);
         chartData[chart] = CHART_DETAILS[chart];
      });
       */
    } catch (error) {
      logger.debug("Could not display the chart -> get all graphs 500 error: ", error);
      return raiseServerError(res);
    }
  };

  /**
   * Function to add the selected graph on the dashboard page.
   * These are 5 pre-defined graphs, which are for displaying the Vitals
   *
   * @param req
   * @param res
   * @returns {Promise<*>}
   */
  addGraphType = async (req, res) => {
    const { raiseServerError, raiseSuccess } = this;
    try {
      // const {params: {id} = {}, userDetails: {userId} = {}} = req;
      const { body: { chart_ids = [] } = {} } = req;
      const { userDetails } = req;
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

      /*
      logger.debug("userPreference.getChartDetails().includes(id) ", userPreference.getChartDetails().includes(id));

      userPreference.getChartDetails().forEach(id => {
          if(chart_ids.includes(id)) {
              return this.raiseClientError(res, 422, {}, "Chart Type already added");
          }
      });*/

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

      const updatedUserPreferenceData =
        await userPreferenceService.getPreferenceByData({
          user_role_id: userRoleId,
        });

      const updatedUserPreference = await UserPreferenceWrapper(
        updatedUserPreferenceData
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
      logger.debug("Adding Graphs not working correctly: ", error);
      return raiseServerError(res);
    }
  };

  /**
   * Graphs for the Provider, which can have multiple Doctors
   *
   * @param req
   * @param res
   * @returns {Promise<*>}
   */
  updateProviderGraph = async (req, res) => {
    const { raiseServerError, raiseClientError, raiseSuccess } = this;
    try {
      const { userDetails: { userData: { category } = {} } = {} } = req;

      // only admin api
      if (category !== USER_CATEGORY.ADMIN) {
        return raiseClientError(res, 401, {}, "UNAUTHORIZED");
      }

      // get all providers in platform
      const allProviders = (await ProviderService.getAllProviders()) || [];

      if (allProviders.length > 0) {
        for (let index = 0; index < allProviders.length; index++) {
          const provider = await ProviderWrapper(allProviders[index]);

          const { user_id } = await provider.getReferenceInfo();

          const userRole = await userRolesService.getFirstUserRole(user_id);

          const { id: user_role_id = null } = userRole || {};

          const userPreferenceExists =
            (await userPreferenceService.getPreferenceByData({
              user_role_id,
            })) || null;

          if (!userPreferenceExists) {
            await userPreferenceService.addUserPreference({
              user_id,
              user_role_id,
              details: {
                charts: ["1", "2", "3", "4", "5"],
              },
            });
          }
        }
      }

      return raiseSuccess(
        res,
        200,
        {},
        "Provider preferences updated successfully"
      );
    } catch (error) {
      logger.debug("Updated Provider Graph not working: ", error);
      return raiseServerError(res);
    }
  };
}

export default new GraphController();
