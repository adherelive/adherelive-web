import express from "express";
import Authenticate from "../middleware/auth";
import SyncController from "../../../app/controllers/mControllers/syncOfflineData/sync.controller.js";

const router = express.Router();

router.post("/", Authenticate, SyncController.syncOfflineData);

export default router;
