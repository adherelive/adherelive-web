import express from "express";
import serviceSubscribeTx from "../../../app/controllers/serviceSubscribeTransaction/serviceSubscribeTransaction.controller";
import isAllowed from "../../middlewares/permissions";
import PERMISSIONS from "../../../config/permissions";
// import Authenticate from "../middleware/auth";
// import { isDoctor } from "../middleware/doctor";

import Authenticate from "../../commonmiddlewares/auth";
import { isDoctor } from "../../commonmiddlewares/doctor";

const router = express.Router();
router.post("/", Authenticate, serviceSubscribeTx.create);
router.post("/activity", Authenticate, serviceSubscribeTx.createActivity);

router.get(
  "/",
  Authenticate,
  serviceSubscribeTx.getServiceSubscriptionTxForUser
);
router.put("/:id", Authenticate, serviceSubscribeTx.updateTx);

export default router;
