import express from "express";
import transactionActivity from "../../../app/controllers/transactionActivity/transactionActivity.controller";
import Authenticate from "../middleware/auth";
import { isDoctor } from "../middleware/doctor";

const router = express.Router();
// router.post("/", Authenticate, serviceSubscribeTx.create);
router.get("/", Authenticate, isDoctor, transactionActivity.getTxActivities);
router.get("/tasks", Authenticate, isDoctor, transactionActivity.getTxActivitiesbyPatient);
router.put("/:id", Authenticate, transactionActivity.updateTxActivities);
router.put("/reassign/:id", Authenticate, transactionActivity.reassignTxActivities);

export default router;
