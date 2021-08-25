const express = require("express");
const router = express.Router();

import Authenticate from "../middlewares/auth";
import Portion from "../../../app/controllers/mControllers/portions/portions.controller";

router.get(
    "/",
    Authenticate,
    Portion.getAll
);

module.exports = router;