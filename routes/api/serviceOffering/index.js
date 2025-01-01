import express from "express";
import ServiceOffering from "../../../app/controllers/serviceOffering/serviceOffering.controller";

import Authenticate from "../../commonmiddlewares/auth";
import { isDoctor } from "../../commonmiddlewares/doctor";

const router = express.Router();

// router.post("/", Authenticate, isDoctor, ServiceOffering.create);
router.post("/", Authenticate, ServiceOffering.create);

router.get(
  "/",
  Authenticate,
  isDoctor,
  ServiceOffering.getServiceOfferingByData
);

router.put(
  "/:id",
  Authenticate,
  isDoctor,
  ServiceOffering.updateServiceOffering
);

router.get(
  "/user",
  Authenticate,
  isDoctor,
  ServiceOffering.getServiceOfferingForUser
);

router.get(
  "/provider/:doctor_id",
  Authenticate,
  ServiceOffering.getServiceOfferingForAdmin
);

router.get(
  "/doctor",
  Authenticate,
  ServiceOffering.getServiceOfferingForPatient
);

router.get(
  "/:id",
  Authenticate,
  isDoctor,
  ServiceOffering.getServiceOfferingById
);

export default router;
