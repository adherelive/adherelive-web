const express = require("express");
const router = express.Router();

import CdssController from "../../../app/controllers/cdss/cdss.controller";
import Authenticate from "../middleware/auth";

router.post("/", Authenticate, CdssController.addDiagnosis);
router.post("/get", Authenticate, CdssController.getDiagnosis);
router.get("/", Authenticate, CdssController.listDiagnosis);

module.exports = router;
