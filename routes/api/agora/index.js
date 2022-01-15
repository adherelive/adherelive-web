const express = require("express");
const router = express.Router();

import agoraController from "../../../app/controllers/agora/agora.controller";
import Authenticated from "../middleware/auth";

const nocache = (req, resp, next) => {
  resp.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
  resp.header("Expires", "-1");
  resp.header("Pragma", "no-cache");
  next();
};

router.get(
  "/video/token/:id",
  Authenticated,
  nocache,
  agoraController.generateVideoAccessToken
);

router.post("/missed", Authenticated, agoraController.missedCall);

router.post("/start", Authenticated, agoraController.startCall);

module.exports = router;
