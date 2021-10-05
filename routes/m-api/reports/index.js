import express from "express";
import Authenticated from "../middlewares/auth";
import Report from "../../../app/controllers/mControllers/reports/report.controller";
import {isDoctor} from "../middlewares/doctor";

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({dest: "../../../app/public/", storage: storage});

const router = express.Router();

router.get(
    "/latest",
    Authenticated,
    isDoctor,
    Report.latestReport
)

router.post(
    "/",
    Authenticated,
    // validate.addReportForm,
    Report.addReports
);

router.post(
    "/upload/:patient_id",
    Authenticated,
    upload.single("files"),
    Report.uploadReportDocuments
);

router.delete(
    "/:document_id",
    Authenticated,
    Report.deleteReportDocument
);

// router.post(
//     "/:id",
//     Authenticated,
//     // validate.addReportForm,
//     Report.updateReports
// );

module.exports = router;
