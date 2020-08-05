const express = require("express");
const router = express.Router();
import twilioController from "../../../app/controllers/mControllers/twilio/twilio.controller";

router.get(
  "/getTwilioVideoAccessToken",
  twilioController.generateTwilioVideoAccessToken
);

router.get(
  "/getTwilioChatAccessToken",
  twilioController.generateTwilioChatAccessToken
);

router.get(
  "/getConnectedParticipants/:roomId",
  twilioController.getConnectedParticipants
);

module.exports = router;
