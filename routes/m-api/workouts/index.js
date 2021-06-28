import express from "express";
import Authenticate from "../middlewares/auth";
import Authorize from "../middlewares/authorize";
import workoutResponseRouter from "../workoutResponses";

import Workout from "../../../app/controllers/mControllers/workouts/workout.controller";
import { USER_CATEGORY } from "../../../constant";

const router = express.Router();

// router.use("/templates", templateRouter);
router.use("/response", workoutResponseRouter);

router.get(
  "/patients",
  Authenticate,
  Authorize(USER_CATEGORY.PATIENT, USER_CATEGORY.DOCTOR),
  Workout.getAll
);

router.get(
  "/details",
  Authenticate,
  Authorize(USER_CATEGORY.PATIENT, USER_CATEGORY.DOCTOR),
  Workout.details
);

router.get(
  "/:id/timeline",
  Authenticate,
  Authorize(USER_CATEGORY.PATIENT, USER_CATEGORY.DOCTOR),
  Workout.timeline
);

router.get(
  "/:id",
  Authenticate,
  Authorize(USER_CATEGORY.PATIENT, USER_CATEGORY.DOCTOR),
  Workout.get
);

router.post("/", Authenticate, Authorize(USER_CATEGORY.DOCTOR), Workout.create);

router.post(
  "/:id",
  Authenticate,
  Authorize(USER_CATEGORY.DOCTOR),
  Workout.update
);

router.delete(
  "/:id",
  Authenticate,
  Authorize(USER_CATEGORY.DOCTOR),
  Workout.delete
);

export default router;
