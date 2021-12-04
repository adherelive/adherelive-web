const express = require("express");
const router = express.Router();

import Authenticate from "../middlewares/auth";
import College from "../../../app/controllers/mControllers/college/college.controller";

router.get(
  "/",
  Authenticate,
  College.getAll
);

module.exports = router;