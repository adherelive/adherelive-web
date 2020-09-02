import express from "express";
import VitalController from "../../../app/controllers/mControllers/vitals/vital.controller";
import Authenticate from "../middleware/auth";
// import * as validator from "./validator";
const router  = express.Router();

router.get(
    "/",
    Authenticate,
    VitalController.search
);

export default router;