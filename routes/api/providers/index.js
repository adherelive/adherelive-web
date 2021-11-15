// const express = require("express");
import express from "express";
import Authenticate from "../middleware/auth";
import { isProvider } from "../middleware/provider";
import ProvidersController from "../../../app/controllers/providers/providers.controller";
// import * as validator from "./validator";

const router = express.Router();

router.get("/doctors", Authenticate, isProvider, ProvidersController.getAll);

router.get(
  "/appointments-count",
  Authenticate,
  isProvider,
  ProvidersController.getMonthAppointmentCountForDoctors
);

router.get(
  "/day-appointments",
  Authenticate,
  isProvider,
  ProvidersController.getAppointmentForDoctors
);

router.get(
    "/patients",
    Authenticate,
    isProvider,
    ProvidersController.getPatientEvents
);

router.post(
    "/mail-password",
    Authenticate,
    isProvider,
    ProvidersController.mailPassword
);

// router.post(
//   "/payment-products",
//   Authenticate,
//   isProvider,
//   ProvidersController.addPaymentProduct
// );

module.exports = router;
