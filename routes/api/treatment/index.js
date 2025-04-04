const express = require("express");
const router = express.Router();

import Authenticate from "../middleware/auth";
import Treatment from "../../../app/controllers/treatment/treatment.controller";

router.get("/", Authenticate, Treatment.getAll);

module.exports = router;
