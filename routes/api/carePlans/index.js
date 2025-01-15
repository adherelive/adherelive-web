import express from "express";
import Authenticated from "../middleware/auth";
import CarePlanController from "../../../app/controllers/carePlans/carePlan.controller";

import * as validator from "./validator";
import isAllowed from "../../middlewares/permissions";
import PERMISSIONS from "../../../config/permissions";

// var storage = multer.memoryStorage();
// var upload = multer({ dest: "../app/public/", storage: storage });

const router = express.Router();

// router.post('/create-medications-and-appointments/:carePlanId',

router.post(
  "/profile",
  Authenticated,
  isAllowed(PERMISSIONS.CARE_PLAN.ADD_PROFILE),
  CarePlanController.addProfile
);

router.post(
  "/:carePlanId",
  Authenticated,
  // Authorize(USER_CATEGORY.DOCTOR),
  isAllowed(PERMISSIONS.CARE_PLAN_TEMPLATE.ADD),
  validator.validateCreateCarePlanFromTemplate,
  CarePlanController.createFromTemplate
);

// GAURAV NEW CHANGES
router.get(
  "/patient-care-plan-name",
  Authenticated,
  CarePlanController.getPatientCarePlanOnly
);

router.get(
  "/patient-care-plan-details/:patientId",
  Authenticated,
  CarePlanController.getPatientCarePlanDetails
);

router.get(
  "/patient-care-plan-details-sec/:patient_id",
  Authenticated,
  CarePlanController.getPatientCarePlanPrimaryAndSecDetails
);

router.get(
  "/:carePlanId",
  Authenticated,
  // Authorize(USER_CATEGORY.DOCTOR),
  isAllowed(PERMISSIONS.CARE_PLAN_TEMPLATE.ADD),
  // validator.validateCreateCarePlanFromTemplate,
  CarePlanController.getCarePlanDetails
);

// router.get('/patient-care-plan-details/:patientId',

// router.get('/patient-care-plan-details/:patientId',
// router.get('/:patientId',
//     CarePlanController.getPatientCarePlanDetails
// );

module.exports = router;
