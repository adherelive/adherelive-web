import express from "express";
import Authenticated from "../middleware/auth";
import Report from "../../../app/controllers/reports/report.controller";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ dest: "../../../app/public/", storage: storage });

const router = express.Router();

router.post(
  "/",
  Authenticated,
  async (req, res, next) => {
    try {
      await Report.addReports(req, res);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/upload/:patient_id",
  Authenticated,
  upload.single("files"),
  async (req, res, next) => {
    try {
      await Report.uploadReportDocuments(req, res);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/:id",
  Authenticated,
  async (req, res, next) => {
    try {
      await Report.updateReports(req, res);
    } catch (error) {
      next(error);
    }
  }
);

router.delete("/:document_id", Authenticated, async (req, res, next) => {
    try {
      await Report.deleteReportDocument(req, res);
    } catch (error) {
      next(error);
    }
});

export default router;
