const express = require("express");
const router = express.Router();

import Authenticate from "../middleware/auth";
import Degree from "../../../app/controllers/degree/degree.controller";

router.get(
    "/",
    Authenticate,
    Degree.getAll
);

module.exports = router;