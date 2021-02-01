import express from "express";
import Authenticate from "../middlewares/auth";
import * as validator from "./validator";

import CarePlanTemplate from "../../../app/controllers/mControllers/carePlanTemplate/carePlanTemplate.controller";


const router = express.Router();

router.get(
    "/",
    Authenticate,
    CarePlanTemplate.getAllForDoctor
);

router.post(
    "/",
    Authenticate,
    // validator.validateCareplanTemplateData,
    CarePlanTemplate.create
);

router.post(
    "/duplicate/:id",
    Authenticate,
    CarePlanTemplate.duplicate
);

router.post(
    "/:id",
    Authenticate,
    CarePlanTemplate.update
);

router.delete(
    "/:id",
    Authenticate,
    // todo-v: add validator IMP
    CarePlanTemplate.delete
);

module.exports = router;