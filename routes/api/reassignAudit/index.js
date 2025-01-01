import express from "express";
import reassignAuditController from "../../../app/controllers/reassignAudit/reassignAudit.controller";
import Authenticate from "../../commonmiddlewares/auth";
import { isDoctor } from "../../commonmiddlewares/doctor";

const router = express.Router();

router.get(
  "/",
  Authenticate,
  isDoctor,
  reassignAuditController.getAuditByActivityId
);

export default router;
