import express from "express";
import multer from "multer";
import Authenticate from "../middlewares/auth";
import Authorize from "../middlewares/authorize";
import DietResponse from "../../../app/controllers/mControllers/dietResponse/dietResponse.controller";
import { USER_CATEGORY } from "../../../constant";

const storage = multer.memoryStorage();
const upload = multer({ dest: "../../../app/public/", storage: storage });

const router = express.Router();

router.post(
  "/",
  Authenticate,
  Authorize(USER_CATEGORY.PATIENT),
  DietResponse.create
);

router.post(
  "/upload",
  Authenticate,
  Authorize(USER_CATEGORY.PATIENT),
  upload.single("files"),
  DietResponse.upload
);

export default router;
