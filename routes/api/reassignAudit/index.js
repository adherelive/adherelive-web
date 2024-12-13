import express from "express";
import reassignAuditController from "../../../app/controllers/reassignAudit/reassignAudit.controller";

const router = express.Router();
import Authenticate from "../../commonmiddlewares/auth";
import { isDoctor } from "../../commonmiddlewares/doctor";

router.get(
  "/",
  Authenticate,
  isDoctor,
  reassignAuditController.getAuditByActivityId
);
export default router;
