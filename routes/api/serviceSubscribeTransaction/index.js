import express from "express";
import serviceSubscribeTransaction from "../../../app/controllers/serviceSubscribeTransaction/serviceSubscribeTransaction.controller";
// import Authenticate from "../middleware/auth";
// import { isDoctor } from "../middleware/doctor";
import Authenticate from "../../commonmiddlewares/auth";

const router = express.Router();
router.post("/", Authenticate, serviceSubscribeTransaction.create);
router.post(
  "/activity",
  Authenticate,
  serviceSubscribeTransaction.createActivity
);

router.get(
  "/",
  Authenticate,
  serviceSubscribeTransaction.getServiceSubscriptionTxForUser
);
router.put("/:id", Authenticate, serviceSubscribeTransaction.updateTx);

export default router;
