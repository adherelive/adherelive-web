import express from "express";
import Authenticate from "../middleware/auth";
import Authorize from "../middleware/authorize";

import WorkoutResponse from "../../../app/controllers/workoutResponses/workoutResponse.controller";
import { USER_CATEGORY } from "../../../constant";

const router = express.Router();

router.get(
    "/",
    Authenticate,
    Authorize(USER_CATEGORY.DOCTOR),
    WorkoutResponse.get
);

export default router;