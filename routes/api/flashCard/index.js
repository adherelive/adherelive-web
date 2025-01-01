import express from "express";
import FlashCard from "../../../app/controllers/flashCard/flashCard.controller";

// import Authenticate from "../middleware/auth";
// import { isDoctor } from "../middleware/doctor";
import Authenticate from "../../commonmiddlewares/auth";

const router = express.Router();

// router.post("/", Authenticate, isDoctor, ServiceOffering.create);
router.post("/", Authenticate, FlashCard.create);

router.get(
  "/:patient_id",
  Authenticate,
  FlashCard.getFlashCardDetailsByPatientId
);

router.get(
  "/activity/:tx_activity_id",
  Authenticate,
  FlashCard.getFlashCardDetailsByActivityId
);

router.put("/:id", Authenticate, FlashCard.update);

// router.get(
//     "/user",
//     Authenticate,
//     isDoctor,
//     ServiceOffering.getServiceOfferingForUser
// );

// router.get(
//     "/provider/:doctor_id",
//     Authenticate,
//     ServiceOffering.getServiceOfferingForAdmin
// );

// router.get(
//     "/:id",
//     Authenticate,
//     isDoctor,
//     ServiceOffering.getServiceOfferingById
// );

export default router;
