import express from "express";
import Authenticate from "../middleware/auth";

import CarePlanTemplate from "../../../app/controllers/carePlanTemplate/carePlanTemplate.controller";
import isAllowed from "../../middlewares/permissions";
import PERMISSIONS from "../../../config/permissions";

const router = express.Router();

router.get(
  "/",
  Authenticate,
  isAllowed(PERMISSIONS.CARE_PLAN_TEMPLATE.VIEW),
  CarePlanTemplate.getAllForDoctor
);

// gaurav chnages
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
  // todo-v: add validator IMP
  isAllowed(PERMISSIONS.CARE_PLAN_TEMPLATE.DELETE),
  CarePlanTemplate.delete
);

module.exports = router;
