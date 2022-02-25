const express = require("express");
const router = express.Router();
import Authenticate from "../middlewares/auth";
import UserDeviceController from "../../../app/controllers/mControllers/userDevice/userDevice.controller";
import * as validator from "./validator";

router.post(
  "/",
  Authenticate,
  validator.addUserDeviceSchema,
  UserDeviceController.create
);

router.delete("/", Authenticate, UserDeviceController.delete);

module.exports = router;
