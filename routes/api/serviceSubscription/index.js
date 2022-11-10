import express from "express";
import ServiceSubscriptionController from "../../../app/controllers/serviceSubscription/serviceSubscription.controller";
// import Authenticate from "../middleware/auth";
// import { isDoctor } from "../middleware/doctor";
import Authenticate from "../../commonmiddlewares/auth";
import { isDoctor } from "../../commonmiddlewares/doctor";
const router = express.Router();

router.post("/", Authenticate, ServiceSubscriptionController.create);
router.get(
  "/",
  Authenticate,
  isDoctor,
  ServiceSubscriptionController.getServiceOfferingByData
);
router.put(
  "/:id",
  Authenticate,
  ServiceSubscriptionController.updateServiceSubscription
);
router.get(
  "/user",
  Authenticate,
  isDoctor,
  ServiceSubscriptionController.getServiceOfferingForUser
);

router.get(
  "/provider/:doctor_id",
  Authenticate,
  ServiceSubscriptionController.getServiceSubscriptionForAdmin
);

router.get(
  "/:id",
  Authenticate,
  isDoctor,
  ServiceSubscriptionController.getServiceOfferingById
);
export default router;
