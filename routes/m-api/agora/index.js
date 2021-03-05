const express = require("express");
const router = express.Router();

import agoraController from "../../../app/controllers/mControllers/agora/agora.controller";
import Authenticated from "../middlewares/auth";

router.get(
    "/video-token/:id",
    Authenticated,
    agoraController.generateVideoAccessToken
  );
  
module.exports = router;