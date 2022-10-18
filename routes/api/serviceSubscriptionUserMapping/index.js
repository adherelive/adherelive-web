import express from "express";
import ServiceSubscriptionUserMapping from "../../../app/controllers/serviceSubscriptionUserMapping/serviceSubscriptionUserMapping.controller";
import Authenticate from "../middleware/auth";
import { isDoctor } from "../middleware/doctor";

const router = express.Router();

router.post("/", Authenticate, isDoctor, ServiceSubscriptionUserMapping.create);
router.put(
  "/:id",
  Authenticate,
  ServiceSubscriptionUserMapping.updateServiceSubscriptionUserMapping
);
router.get(
  "/:patient_id",
  Authenticate,
  isDoctor,
  ServiceSubscriptionUserMapping.getServiceSubscriptionUserMappingByPatientId
);

router.get(
  "/all/:patient_id",
  Authenticate,
  isDoctor,
  ServiceSubscriptionUserMapping.getServiceSubscriptionUserMappingAndServiceUserByPatientId
);

// router.get("/", ServiceUserMappingController.getServiceOfferingByData);
// router.post("/:id", ServiceUserMappingController.updateServiceSubscription);
// router.get("/:id", ServiceUserMappingController.getServiceOfferingById);
export default router;
