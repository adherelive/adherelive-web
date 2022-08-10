const express = require("express");
const router = express.Router();

import CdssController from "../../../app/controllers/cdss/cdss.controller";
import Authenticate from "../middleware/auth";

router.post("/", Authenticate, CdssController.addDyanosis);
router.post("/get", Authenticate, CdssController.getDyanosis);
router.get("/", Authenticate, CdssController.listDyanosis);

module.exports = router;
