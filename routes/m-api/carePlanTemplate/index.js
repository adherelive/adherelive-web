import express from "express";
import Authenticate from "../middlewares/auth";

import CarePlanTemplate from "../../../app/controllers/mControllers/carePlanTemplate/carePlanTemplate.controller";
import isAllowed from "../../middlewares/permissions";
import PERMISSIONS from "../../../config/permissions";

const router = express.Router();

router.get(
  "/",
  Authenticate,
  isAllowed(PERMISSIONS.CARE_PLAN_TEMPLATE.VIEW),
  CarePlanTemplate.getAllForDoctor
);

// Search changes for finding Patients
router.get(
  "/search",
  Authenticate,
  isAllowed(PERMISSIONS.CARE_PLAN_TEMPLATE.VIEW),
  CarePlanTemplate.searchAllTemplatesForDoctor
);

router.post(
  "/",
  Authenticate,
  isAllowed(PERMISSIONS.CARE_PLAN_TEMPLATE.ADD),
  // validator.validateCarePlanTemplateData,
  CarePlanTemplate.create
);

router.post(
  "/duplicate/:id",
  Authenticate,
  isAllowed(PERMISSIONS.CARE_PLAN_TEMPLATE.DUPLICATE),
  CarePlanTemplate.duplicate
);

router.post(
  "/:id",
  Authenticate,
  isAllowed(PERMISSIONS.CARE_PLAN_TEMPLATE.UPDATE),
  CarePlanTemplate.update
);

router.delete(
  "/:id",
  Authenticate,
  isAllowed(PERMISSIONS.CARE_PLAN_TEMPLATE.DELETE),
  // TODO: add validator IMP
  CarePlanTemplate.delete
);

module.exports = router;
