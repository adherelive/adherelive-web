import Authenticated from "../middleware/auth";

const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const PdfService = require('../../../app/services/prescriptions/pdfService');
const {raiseClientError} = require("../helper");
const CarePlanWrapper = require("../../../app/apiWrapper/web/carePlan");
const moment = require("moment/moment");

const pdfService = new PdfService();

router.get('/generate-pdf/:care_plan_id', Authenticated, async (req, res) => {
    try {
        const {language} = req.body;

        const {care_plan_id = null} = req.params;
        if (!care_plan_id) {
            return raiseClientError(res, 422, {}, "Invalid Care Plan!");
        }

        // Example template and data
        const htmlTemplate = await fs.readFile(__dirname + '/prescription-template.html', 'utf8');
        const data = {
            title: 'Sample Document',
            content: 'This is sample content',
            // Add more fields as needed
        };

        const pdf = await pdfService.generatePDF(htmlTemplate, data, language);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=document_${language}.pdf`);
        res.contentType("application/pdf");
        return res.send(pdf);
    } catch (error) {
        console.error('Error in PDF generation route:', error);
        res.status(500).json({error: 'Failed to generate PDF'});
    }
});

module.exports = router;