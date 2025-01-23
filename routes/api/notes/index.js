import express from "express";
import NotesController from "../../../app/controllers/notes/notes.controller";
import isAllowed from "../../middlewares/permissions";
import PERMISSIONS from "../../../config/permissions";

import Authenticate from "../../commonmiddlewares/auth";
import { isDoctor } from "../../commonmiddlewares/doctor";

const router = express.Router();

// router.post("/", Authenticate, isDoctor, ServiceOffering.create);
router.post("/", Authenticate, NotesController.create);

router.get("/:patient_id", Authenticate, NotesController.getNotesByPatientId);

export default router;
