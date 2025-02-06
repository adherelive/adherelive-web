import express from "express";
import FlashCard from "../../../app/controllers/flashCard/flashCard.controller";

import Authenticate from "../../commonmiddlewares/auth";

const router = express.Router();

// router.post("/", Authenticate, isDoctor, ServiceOffering.create);
router.post("/", Authenticate, FlashCard.create);

/**
 * @swagger
 * /flashCard/{patient_id}:
 *  get:
 *    summary: Retrieve a list of flashCard for a patient
 *    responses:
 *      200:
 *        description: A list of flashCard
 */
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

router.put("/:id/update", Authenticate, FlashCard.update);

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
