const express = require("express");
const router = express.Router();
import Authenticate from "../middlewares/auth";

import mDoctorController from "../../../app/controllers/mControllers/doctors/doctor.controller";
import mFeatureController from "../../../app/controllers/mControllers/features/features.controller";
import {isDoctor} from "../middlewares/doctor";

router.post(
    "/toggleChatMessagePermission/:patient_id",
    Authenticate,
    isDoctor,
    mDoctorController.toggleChatMessagePermission
);

router.post(
    "/toggleVideoCallPermission/:patient_id",
    Authenticate,
    isDoctor,
    mDoctorController.toggleVideoCallPermission
);

router.get("/", Authenticate, mFeatureController.getAllFeaturesMappingForUser);

module.exports = router;
