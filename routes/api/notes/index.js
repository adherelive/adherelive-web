import express from "express";
import NotesController from "../../../app/controllers/notes/notes.controller";

import Authenticate from "../middleware/auth";

const router = express.Router();

// router.post("/", Authenticate, isDoctor, ServiceOffering.create);
router.post("/", Authenticate, NotesController.create);

router.get("/:patient_id", Authenticate, NotesController.getNotesByPatientId);

export default router;
