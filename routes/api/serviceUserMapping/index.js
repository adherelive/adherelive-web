import express from "express";
import ServiceUserMappingController from "../../../app/controllers/serviceUserMapping/serviceUserMapping.controller";

import Authenticate from "../../commonmiddlewares/auth";
import { isDoctor } from "../../commonmiddlewares/doctor";

const router = express.Router();

router.post("/", Authenticate, isDoctor, ServiceUserMappingController.create);

router.put(
  "/:id/update",
  Authenticate,
  ServiceUserMappingController.updateServiceUserMapping
);

router.get(
  "/:patient_id",
  Authenticate,
  isDoctor,
  ServiceUserMappingController.getServiceUserMappingByData
);
// router.get("/", ServiceUserMappingController.getServiceOfferingByData);
// router.post("/:id", ServiceUserMappingController.updateServiceSubscription);
// router.get("/:id", ServiceUserMappingController.getServiceOfferingById);
export default router;
