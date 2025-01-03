import express from "express";
import { isProvider } from "../middlewares/provider";
import Authenticate from "../middlewares/auth";
import MobileProvidersController from "../../../app/controllers/mControllers/providers/providers.controller";

const router = express.Router();

// Example API call:
// http://localhost:3000/api/providers/day-appointments?value=2021-12-23T07:24:37.315Z&type=m

router.get(
  "/day-appointments",
  Authenticate,
  isProvider,
  MobileProvidersController.getAppointmentForDoctors
);

module.exports = router;
