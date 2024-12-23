const { raiseSuccess, raiseClientError, raiseServerError } = this;

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

  let care_planss = null;
  if (carePlans.length > 0) {
    const { care_plans, care_plan_ids, current_careplan_id } =
      await carePlanHelper.getCareplanDataWithImp({
        carePlans,
        userCategory: category,
        doctorId: userCategoryId,
        userRoleId,
      });
    care_planss = care_plans;
    // care plan ids
    carePlanIds = [...care_plan_ids];
  }

  const patientCarePlans =
    newData.length > 0 &&
    newData.filter((id) => {
      const { basic_info: { patient_id: carePlanPatientId = "0" } = {} } =
        care_planss[id] || {};
    });

  if (patientCarePlans.length > 0) {
    latestCarePlanId = patientCarePlans[0];
  }
  return raiseSuccess(
    res,
    200,
    {
      care_plans: care_planss,
    },
    "Patient care plan details fetched successfully"
  );
} catch (error) {
  // Logger.debug("get careplan 500 error ---> ", error);
  console.log("GET PATIENT DETAILS ERROR careplan --> ", error);
  return raiseServerError(res);
}
