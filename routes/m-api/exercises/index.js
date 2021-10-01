import express from "express";
import multer from "multer";
import Authenticate from "../middlewares/auth";
import Authorize from "../middlewares/authorize";

import Exercise from "../../../app/controllers/mControllers/exercises/exercise.controller";

import * as validate from "./validate";
import { USER_CATEGORY } from "../../../constant";

const storage = multer.memoryStorage();
const upload = multer({ dest: "../../../app/public/", storage: storage });

const router = express.Router();

router.get(
  "/",
  Authenticate,
  // validate.search,
  Authorize(USER_CATEGORY.DOCTOR, USER_CATEGORY.HSP),
  Exercise.search
);

router.post("/", Authenticate, Authorize(USER_CATEGORY.DOCTOR,USER_CATEGORY.HSP),validate.create, Exercise.create);

router.post(
  "/upload",
  Authenticate,
  Authorize(USER_CATEGORY.DOCTOR, USER_CATEGORY.HSP),
  upload.single("files"),
  Exercise.uploadContent
);

router.post(
  "/:id",
  Authenticate,
  Authorize(USER_CATEGORY.DOCTOR, USER_CATEGORY.HSP),
  // validate.update,
  Exercise.update
);

export default router;
