const express = require("express");
const router = express.Router();

import agoraController from "../../../app/controllers/agora/agora.controller";
import Authenticated from "../middleware/auth";

router.get(
    "/video/token/:id",
    Authenticated,
    agoraController.generateVideoAccessToken
);


router.post(
    "/missed",
    Authenticated,
    agoraController.missedCall
)

router.post(
    "/start",
    Authenticated,
    agoraController.startCall
);

module.exports = router;
