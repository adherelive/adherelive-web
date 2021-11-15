const express = require("express");
import Authenticate from "../middleware/auth";
import * as validator from "./validator";

import Chat from "../../../app/controllers/chat/chat.controller";

const router = express.Router();

router.post(
  "/notify",
  Authenticate,
  // validator.validateChatData,
  Chat.notify
);

export default router;