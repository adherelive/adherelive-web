/**
 * In JavaScript, the top-level this typically refers to the global object when you're not inside any function or class.
 * However, in the context of a Node.js module, the top-level this is "module.exports",
 * which represents the exports of the module. This means that if you use this outside of a function or class in
 * a Node.js file, it's not particularly useful or meaningful.
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
// const {raiseSuccess, raiseClientError, raiseServerError} = this;
//
// try {
//     const {id: patient_id = 1} = req.params;
//     const {
//         userDetails: {
//             userRoleId = null,
//             userId,
//             userCategoryId,
//             userData: {category} = {},
//         } = {},
//     } = req;
//
//     let newData = [];
//     if (req.userDetails.userCategoryData.care_plan_ids) {
//         newData = req.userDetails.userCategoryData.care_plan_ids[userRoleId];
//     }
//
//     if (!patient_id) {
//         return raiseClientError(
//             res,
//             422,
//             {},
//             "Please select correct patient to continue"
//         );
//     }
//
//     const carePlans =
//         (await carePlanService.getMultipleCarePlanByData({
//             patient_id,
//             // user_role_id: userRoleId,
//         })) || [];
//
//     let carePlanIds = [];
//     let latestCarePlanId = null;
//
//     let carePlansSet = null;
//     if (carePlans.length > 0) {
//         const {care_plans, care_plan_ids, current_care_plan_id} =
//             await carePlanHelper.getCarePlanDataWithImp({
//                 carePlans,
//                 userCategory: category,
//                 doctorId: userCategoryId,
//                 userRoleId,
//             });
//         carePlansSet = care_plans;
//         // care plan ids
//         carePlanIds = [...care_plan_ids];
//     }
//
//     const patientCarePlans =
//         newData.length > 0 &&
//         newData.filter((id) => {
//             const {basic_info: {patient_id: carePlanPatientId = "0"} = {}} =
//             carePlansSet[id] || {};
//         });
//
//     if (patientCarePlans.length > 0) {
//         latestCarePlanId = patientCarePlans[0];
//     }
//     return raiseSuccess(
//         res,
//         200,
//         {care_plans: carePlansSet},
//         "Patient care plan details fetched successfully"
//     );
// } catch (error) {
//     log.debug("Get CarePlan 500 error ---> ", error);
//     log.info("GET PATIENT DETAILS ERROR Care Plan ---> ", error);
//     return raiseServerError(res);
// }
