const express = require("express");
const router = express.Router();

import Authenticate from "../middleware/auth";
import Severity from "../../../app/controllers/severity/severity.controller";

router.get(
    "/",
    Authenticate,
    Severity.getAll
);

module.exports = router;