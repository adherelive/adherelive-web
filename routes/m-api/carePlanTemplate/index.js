import express from "express";
import Authenticate from "../middlewares/auth";
import * as validator from "./validator";

import CarePlanTemplate from "../../../app/controllers/mControllers/carePlanTemplate/carePlanTemplate.controller";


const router = express.Router();

router.post(
    "/",
    Authenticate,
    // validator.validateCareplanTemplateData,
    CarePlanTemplate.create
);

module.exports = router;