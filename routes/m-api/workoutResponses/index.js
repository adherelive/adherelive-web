import express from "express";
import Authenticate from "../middlewares/auth";
import Authorize from "../middlewares/authorize";

import WorkoutResponse from "../../../app/controllers/mControllers/workoutResponses/workoutResponse.controller";
import { USER_CATEGORY } from "../../../constant";

const router = express.Router();

router.get(
  "/",
  Authenticate,
  Authorize(USER_CATEGORY.DOCTOR, USER_CATEGORY.HSP, USER_CATEGORY.PATIENT),
  WorkoutResponse.get
);

router.post(
  "/",
  Authenticate,
  Authorize(USER_CATEGORY.PATIENT),
  WorkoutResponse.create
);

router.post(
  "/skip",
  Authenticate,
  Authorize(USER_CATEGORY.PATIENT),
  WorkoutResponse.skip
);

router.post(
  "/:id",
  Authenticate,
  Authorize(USER_CATEGORY.PATIENT),
  WorkoutResponse.update
);

export default router;
