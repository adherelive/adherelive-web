const express = require("express");
const router = express.Router();
import Authenticate from "../middleware/auth";

import Doctor from "../../../app/controllers/doctors/doctor.controller";

router.get(
    "/doctors",
    Authenticate,
    Doctor.getAll
);

module.exports = router;