const express = require("express");
const router = express.Router();

import Authenticate from "../middleware/auth";
import Condition from "../../../app/controllers/condition/condition.controller";

router.get(
    "/",
    Authenticate,
    Condition.getAll
);

module.exports = router;