const express = require("express");
const router = express.Router();

import Authenticate from "../middlewares/auth";
import Condition from "../../../app/controllers/mControllers/condition/condition.controller";

router.get(
  "/",
  Authenticate,
  // validator.conditionSearch
  Condition.search
);

module.exports = router;