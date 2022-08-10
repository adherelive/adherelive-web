const express = require("express");
const router = express.Router();

import CdssController from "../../../app/controllers/cdss/cdss.controller";

router.post("/", CdssController.addDyanosis);
router.post("/get", CdssController.getDyanosis);
router.get("/", CdssController.listDyanosis);

module.exports = router;
