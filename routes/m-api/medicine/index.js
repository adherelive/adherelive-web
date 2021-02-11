const express = require("express");
const router = express.Router();
import Authenticate from "../middlewares/auth";
import MobilMedicine from "../../../app/controllers/mControllers/medicines/medicine.controller";
// import * as validator from "./validator";

router.get("/", Authenticate, MobilMedicine.searchMedicine);


router.post("/", Authenticate, MobilMedicine.addMedicine);

module.exports = router;
