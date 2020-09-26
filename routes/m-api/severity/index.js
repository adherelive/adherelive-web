const express = require("express");
const router = express.Router();

import Authenticate from "../middlewares/auth";
import Severity from "../../../app/controllers/mControllers/severity/severity.controller";

router.get(
    "/",
    Authenticate,
    Severity.getAll
);

module.exports = router;