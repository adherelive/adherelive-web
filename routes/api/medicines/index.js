const express = require("express");
const router = express.Router();

import Authenticate from "../middleware/auth";
import Medicine from "../../../app/controllers/medicines/medicine.controller";

router.get("/", Authenticate, Medicine.getAll);

router.post("/", Authenticate, Medicine.addMedicineByAdmin);

module.exports = router;
