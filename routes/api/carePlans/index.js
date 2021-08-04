import express from "express";
import Authenticated from "../middleware/auth";
import CarePlanController from "../../../app/controllers/carePlans/carePlan.controller";
// import multer from "multer";
// var storage = multer.memoryStorage();
// var upload = multer({ dest: "../app/public/", storage: storage });
import * as validator from "./validator";
import isAllowed from "../../middlewares/permissions";
import PERMISSIONS from "../../../config/permissions";
const router = express.Router();

// router.post('/create-medications-and-appointments/:carePlanId',
router.post('/:carePlanId',
    Authenticated,
    // Authorize(USER_CATEGORY.DOCTOR),
    isAllowed(PERMISSIONS.CARE_PLAN_TEMPLATE.ADD),
    validator.validateCreateCarePlanFromTemplate,
    CarePlanController.createFromTemplate
);

// router.get('/patient-care-plan-details/:patientId',
// router.get('/:patientId',
//     CarePlanController.getPatientCarePlanDetails
// );

module.exports = router;