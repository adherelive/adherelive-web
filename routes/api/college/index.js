const express = require("express");
const router = express.Router();

import Authenticate from "../middleware/auth";
import College from "../../../app/controllers/college/college.controller";

router.get("/", Authenticate, College.getAll);

module.exports = router;
