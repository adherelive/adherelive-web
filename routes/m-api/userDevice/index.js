const express = require("express");
const router = express.Router();
import Authenticate from "../middleware/auth";
import UserDeviceController from "../../../app/controllers/mControllers/userDevice/userDevice.controller";

router.post(
    "/",
    Authenticate,
    UserDeviceController.create
);

router.delete(
    "/",
    Authenticate,
    UserDeviceController.delete
)

module.exports = router;