import express from "express";
import WorkoutTemplate from "../../../app/controllers/workoutTemplates/workoutTemplate.controller";
import Authenticate from "../middleware/auth";
// import * as validate from "./validate";
const router = express.Router();

router.post("/", Authenticate, WorkoutTemplate.create);

router.post("/:id", Authenticate, WorkoutTemplate.update);

router.delete("/:id", Authenticate, WorkoutTemplate.delete);

export default router;
