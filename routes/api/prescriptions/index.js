import carePlanService from "../../../app/services/carePlan/carePlan.service";

const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const PdfService = require('../../../app/services/prescriptions/pdfService');
const {raiseClientError} = require("../helper");
const CarePlanWrapper = require("../../../app/apiWrapper/web/carePlan");
const moment = require("moment/moment");

const pdfService = new PdfService();

function getLatestUpdateDate(medications) {
    const medicationIds = Object.keys(medications);
    let date = null;
    let isPrescriptionUpdated = false;
    for (const medicationId of medicationIds) {
        const {
            [ medicationId ]: {
                basic_info: {updated_at} = {},
                details: mobileDetails = null,
            },
        } = medications;
        let newDate = new Date(updated_at);

        if (date == null) {
            date = newDate;
        } else if (newDate > date) {
            date = newDate;
            isPrescriptionUpdated = true;
        }
    }
    return {date, isPrescriptionUpdated};
}

router.post('/generate-pdf/:care_plan_id', async (req, res) => {
    try {
        const {language} = req.body;

        const {care_plan_id = null} = req.params;
        if (!care_plan_id) {
            return raiseClientError(res, 422, {}, "Invalid Care Plan!");
        }
        let medications = {};
        const carePlan = await carePlanService.getCarePlanById(care_plan_id);
        const carePlanData = await CarePlanWrapper(carePlan);
        const carePlanCreatedDate = carePlanData.getCreatedAt();
        const {clinical_notes, follow_up_advise} =
        ( await carePlanData.getCarePlanDetails() ) || {};
        let {date: prescriptionDate} = getLatestUpdateDate(medications);
        prescriptionDate = prescriptionDate || carePlanCreatedDate;
        let pre_data = {
            clinical_notes,
            follow_up_advise,
            creationDate: moment(prescriptionDate)
                .add(330, "minutes")
                .format("Do MMMM YYYY, h:mm a"),
        };

        // Example template and data
        const htmlTemplate = await fs.readFile(__dirname + './prescription-template.html', 'utf8');
        const data = {
            title: 'Sample Document',
            content: 'This is sample content',
            // Add more fields as needed
        };

        const pdf = await pdfService.generatePDF(htmlTemplate, data, language);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=document_${language}.pdf`);
        res.send(pdf);
    } catch (error) {
        console.error('Error in PDF generation route:', error);
        res.status(500).json({error: 'Failed to generate PDF'});
    }
});

module.exports = router;