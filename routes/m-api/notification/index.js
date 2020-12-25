import express from "express";
import Authenticate from "../middlewares/auth";
import NotificationController from "../../../app/controllers/notification/notification.controller";

const router = express.Router();

router.post(
    "/",
    Authenticate,
    NotificationController.getNotifications
);

module.exports = router;