import express from "express";
import serviceSubscribeTransaction from "../../../app/controllers/serviceSubscribeTransaction/serviceSubscribeTransaction.controller";
import isAllowed from "../../middlewares/permissions";
import PERMISSIONS from "../../../config/permissions";

import Authenticate from "../../commonmiddlewares/auth";
import { isDoctor } from "../../commonmiddlewares/doctor";

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
