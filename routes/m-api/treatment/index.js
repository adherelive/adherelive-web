const express = require("express");
const router = express.Router();

import Authenticate from "../middlewares/auth";
import Treatment from "../../../app/controllers/mControllers/treatment/treatment.controller";

router.get(
    "/",
    Authenticate,
    Treatment.getAll
);

module.exports = router;