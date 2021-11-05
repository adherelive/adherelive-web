import express from "express";
import Authenticate from "../middleware/auth";
import Authorize from "../middleware/authorize";
// import templateRouter from "../workoutTemplates";
import workoutResponseRouter from "../workoutResponses";

import Workout from "../../../app/controllers/workouts/workout.controller";

import { USER_CATEGORY } from "../../../constant";

const router = express.Router();

// router.use("/templates", templateRouter);
router.use("/response", workoutResponseRouter);

router.get(
  "/patients",
  Authenticate,
  Authorize(USER_CATEGORY.DOCTOR, USER_CATEGORY.HSP),
  Workout.getAll
);

router.get(
  "/details",
  Authenticate,
  Authorize(USER_CATEGORY.DOCTOR, USER_CATEGORY.HSP),
  Workout.details
);

router.get(
  "/:id/timeline",
  Authenticate,
  Authorize(USER_CATEGORY.DOCTOR, USER_CATEGORY.HSP),
  Workout.timeline
);

router.get(
  "/:id",
  Authenticate,
  Authorize(USER_CATEGORY.DOCTOR, USER_CATEGORY.HSP),
  Workout.get
);

router.post(
  "/update-calories",
  Authenticate,
  Authorize(USER_CATEGORY.DOCTOR, USER_CATEGORY.HSP),
  Workout.updateTotalCalories
);

router.post(
  "/",
  Authenticate,
  Authorize(USER_CATEGORY.DOCTOR, USER_CATEGORY.HSP),
  Workout.create
);

router.post(
  "/:id",
  Authenticate,
  Authorize(USER_CATEGORY.DOCTOR, USER_CATEGORY.HSP),
  Workout.update
);

router.delete(
  "/:id",
  Authenticate,
  Authorize(USER_CATEGORY.DOCTOR, USER_CATEGORY.HSP),
  Workout.delete
);

export default router;
