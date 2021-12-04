const express = require("express");
const router = express.Router();

import Authenticate from "../middleware/auth";
import Portion from "../../../app/controllers/portions/portions.controller";

router.get(
  "/",
  Authenticate,
  Portion.getAll
);

module.exports = router;