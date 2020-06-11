const express = require("express");
const router = express.Router();
import Authenticate from "../middleware/auth";
import MobilMedicine from "../../../app/controllers/mControllers/medicines/medicine.controller";
// import * as validator from "./validator";

router.get("/", Authenticate, MobilMedicine.searchMedicine);

module.exports = router;
