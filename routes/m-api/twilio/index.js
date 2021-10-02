const express = require("express");
const router = express.Router();
import twilioController from "../../../app/controllers/mControllers/twilio/twilio.controller";
import Authenticated from "../middlewares/auth";

router.get(
    "/getTwilioVideoAccessToken",
    twilioController.generateTwilioVideoAccessToken
);

router.get(
    "/getTwilioChatAccessToken",
    Authenticated,
    twilioController.generateTwilioChatAccessToken
);

router.get(
    "/getConnectedParticipants/:roomId",
    twilioController.getConnectedParticipants
);

module.exports = router;
