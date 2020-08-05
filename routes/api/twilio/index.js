const express = require("express");
const router = express.Router();
import Authenticate from "../middleware/auth";
import twilioController from "../../../app/controllers/twilio/twilio.controller";

router.get(
  "/getTwilioVideoAccessToken",
  twilioController.generateTwilioVideoAccessToken
);

router.get(
  "/getTwilioChatAccessToken",
  Authenticate,
  twilioController.generateTwilioChatAccessToken
);

router.get(
  "/getConnectedParticipants/:roomId",
  twilioController.getConnectedParticipants
);

module.exports = router;
