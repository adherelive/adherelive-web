const express = require("express");
const router = express.Router();

import Authenticate from "../middleware/auth";
import Council from "../../../app/controllers/council/council.controller";

router.get(
    "/",
    Authenticate,
    Council.getAll
);

module.exports = router;