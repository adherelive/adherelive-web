const express = require("express");
const router = express.Router();

import CdssController from "../../../app/controllers/cdss/cdss.controller";
import Authenticate from "../middleware/auth";

router.post("/", Authenticate, cdssController.addDiagnosis);
router.post("/get", Authenticate, cdssController.getDiagnosis);
router.get("/", Authenticate, cdssController.listDiagnosis);

module.exports = router;
