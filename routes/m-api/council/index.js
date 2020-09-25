const express = require("express");
const router = express.Router();

import Authenticate from "../middlewares/auth";
import Council from "../../../app/controllers/mControllers/council/council.controller";

router.get(
    "/",
    Authenticate,
    Council.getAll
);

module.exports = router;