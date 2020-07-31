import express from "express";
import Authenticated from "../middleware/auth";
import CarePlanController from "../../../app/controllers/carePlans/carePlan.controller";
import multer from "multer";
var storage = multer.memoryStorage();
var upload = multer({ dest: "../app/public/", storage: storage });

const router = express.Router();

// router.post('/create-medications-and-appointments/:carePlanId',
router.post('/:carePlanId',
    CarePlanController.createCarePlanMedicationsAndAppointmentsByTemplateData
);

// router.get('/patient-care-plan-details/:patientId',
// router.get('/:patientId',
//     CarePlanController.getPatientCarePlanDetails
// );

module.exports = router;