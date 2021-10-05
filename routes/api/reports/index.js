import express from "express";
import Authenticated from "../middleware/auth";
import Report from "../../../app/controllers/reports/report.controller";

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({dest: "../../../app/public/", storage: storage});

const router = express.Router();

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

router.post(
    "/:id",
    Authenticated,
    // validate.addReportForm,
    Report.updateReports
);

router.delete(
    "/:document_id",
    Authenticated,
    Report.deleteReportDocument
);

module.exports = router;
