const express = require("express");
const router = express.Router();

import Authenticate from "../middleware/auth";
import SpecialityController from "../../../app/controllers/mControllers/speciality/speciality.controller";

router.get(
    "/",
    Authenticate,
    SpecialityController.searchSpeciality
);

module.exports = router;