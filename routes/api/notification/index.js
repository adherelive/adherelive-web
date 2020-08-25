import express from "express";
import Authenticate from "../middleware/auth";
import NotificationController from "../../../app/controllers/notification/notification.controller";

const router = express.Router();

router.get(
    "/",
    Authenticate,
    NotificationController.getNotifications
)