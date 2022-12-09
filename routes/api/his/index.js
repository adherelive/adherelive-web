const express = require("express");
const router = express.Router();
import hisController from "../../../app/controllers/his/his.controller";

router.post("/sign-in", hisController.signIn);

module.exports = router;
