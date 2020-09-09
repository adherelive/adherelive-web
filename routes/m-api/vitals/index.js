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

router.get(
  "/:id",
  Authenticate,
  VitalController.getVitalResponseTimeline
);

router.post(
    "/",
    Authenticate,
    // validator.validateVitalsForm,
    VitalController.createVital
);

router.post(
    "/:id",
    Authenticate,
    VitalController.addVitalResponse
);

export default router;