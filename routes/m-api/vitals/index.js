import express from "express";
import VitalController from "../../../app/controllers/mControllers/vitals/vital.controller";
import Authenticate from "../middleware/auth";
// import * as validator from "./validator";
const router  = express.Router();

router.get(
    "/",
    Authenticate,
    VitalController.search
);

router.get(
    "/details",
    Authenticate,
    VitalController.getVitalFormDetails
);

router.post(
    "/",
    Authenticate,
    // validator.validateVitalsForm,
    VitalController.createVital
);

export default router;