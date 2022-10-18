import express from "express";
import transactionActivity from "../../../app/controllers/transactionActivity/transactionActivity.controller";
import Authenticate from "../middleware/auth";
import { isDoctor } from "../middleware/doctor";

const router = express.Router();
// router.post("/", Authenticate, serviceSubscribeTx.create);
router.get("/", Authenticate, isDoctor, transactionActivity.getTxActivities);
router.put("/:id", Authenticate, transactionActivity.updateTxActivities);

export default router;
