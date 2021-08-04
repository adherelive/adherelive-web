import express from "express";
import Authenticate from "../middleware/auth";
import Authorize from "../middleware/authorize";
// import * as validator from "./validator";

import CarePlanTemplate from "../../../app/controllers/carePlanTemplate/carePlanTemplate.controller";
import { USER_CATEGORY } from "../../../constant";


const router = express.Router();

router.get(
    "/",
    Authenticate,
    Authorize(USER_CATEGORY.DOCTOR),
    CarePlanTemplate.getAllForDoctor
);

router.post(
    "/",
    Authenticate,
    Authorize(USER_CATEGORY.DOCTOR),
    // validator.validateCareplanTemplateData,
    CarePlanTemplate.create
);

router.post(
    "/duplicate/:id",
    Authenticate,
    Authorize(USER_CATEGORY.DOCTOR),
    CarePlanTemplate.duplicate
);

router.post(
    "/:id",
    Authenticate,
    Authorize(USER_CATEGORY.DOCTOR),
    CarePlanTemplate.update
);

router.delete(
    "/:id",
    Authenticate,
    // todo-v: add validator IMP
    Authorize(USER_CATEGORY.DOCTOR),
    CarePlanTemplate.delete
);

module.exports = router;