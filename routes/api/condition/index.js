const express = require("express");
const router = express.Router();

import Authenticate from "../middleware/auth";
import Condition from "../../../app/controllers/condition/condition.controller";

router.get(
    "/",
    Authenticate,
    // validator.validateConditionSearch
    Condition.search
);

module.exports = router;