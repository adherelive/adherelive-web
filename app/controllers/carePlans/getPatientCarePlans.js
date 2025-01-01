import Controller from "../index";

import Logger from "../../../libs/log";
import carePlanService from "../../services/carePlan/carePlan.service";
import * as carePlanHelper from "./carePlan.helper";

const Log = new Logger("CARE_PLAN > Back FIle");

/**
 * In JavaScript, the top-level this typically refers to the global object when you're not inside any function or class.
 * However, in the context of a Node.js module, the top-level this is module.exports,
 * which represents the exports of the module. This means that if you use this outside of a function or class in
 * a Node.jsfile, it's not particularly useful or meaningful.
 *
 * By making sure raiseSuccess, raiseClientError, and raiseServerError are accessible within the function,
 * you avoid the misuse of top-level this and ensure your code runs as intended.
 *
 * @param req
 * @param res
 * @param raiseSuccess
 * @param raiseClientError
 * @param raiseServerError
 * @returns {Promise<*>}
 */
const getPatientCarePlans = async (
  req,
  res,
  { raiseSuccess, raiseClientError, raiseServerError }
) => {
  // const { raiseSuccess, raiseClientError, raiseServerError } = this;

  // const raiseSuccess = (res, status, data, message) => {
  //   return res.status(status).json({ success: true, data, message });
  // };
  //
  // const raiseClientError = (res, status = 400, data = {}, message = "Bad Request") => {
  //   return res.status(status).json({ success: false, data, message });
  // };
  //
  // const raiseServerError = (res, message = "Internal Server Error") => {
  //   return res.status(500).json({ success: false, message });
  // };

  try {
    const { id: patient_id = 1 } = req.params;
    const {
      userDetails: {
        userRoleId = null,
        userId,
        userCategoryId,
        userData: { category } = {},
      } = {},
    } = req;

    let newData = [];
    if (req.userDetails.userCategoryData.care_plan_ids) {
      newData = req.userDetails.userCategoryData.care_plan_ids[userRoleId];
    }

    if (!patient_id) {
      return raiseClientError(
        res,
        422,
        {},
        "Please select correct patient to continue"
      );
    }

    const carePlans =
      (await carePlanService.getMultipleCarePlanByData({
        patient_id,
        // user_role_id: userRoleId,
      })) || [];

    let carePlanIds = [];
    let latestCarePlanId = null;

    let carePlansS = null;
    if (carePlans.length > 0) {
      const { care_plans, care_plan_ids, current_care_plan_id } =
        await carePlanHelper.getCarePlanDataWithImp({
          carePlans,
          userCategory: category,
          doctorId: userCategoryId,
          userRoleId,
        });
      carePlansS = care_plans;
      // care plan ids
      carePlanIds = [...care_plan_ids];
    }

    const patientCarePlans =
      newData.length > 0 &&
      newData.filter((id) => {
        const { basic_info: { patient_id: carePlanPatientId = "0" } = {} } =
          carePlansS[id] || {};
      });

    latestCarePlanId = patientCarePlans.length > 0 ? patientCarePlans[0] : null;
    return raiseSuccess(
      res,
      200,
      { care_plans: carePlansS },
      "Patient care plan details fetched successfully"
    );
  } catch (error) {
    Log.debug("Get CarePlan 500 error ---> ", error);
    console.log("GET PATIENT DETAILS ERROR CarePlan ---> ", error);
    return raiseServerError(res);
  }
};

// Export the function to be used in your route definition
export default getPatientCarePlans;
