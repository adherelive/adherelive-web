const express = require("express");
const router = express.Router();

import Authenticate from "../middlewares/auth";
import Degree from "../../../app/controllers/mControllers/degree/degree.controller";

router.get("/", Authenticate, Degree.getAll);

module.exports = router;
