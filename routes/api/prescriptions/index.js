const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const PdfService = require('../../../app/services/prescriptions/pdfService');

const pdfService = new PdfService();

router.post('/generate-pdf', async (req, res) => {
    try {
        const { language } = req.body;

        // Example template and data
        const htmlTemplate = await fs.readFile(__dirname + './prescription.html', 'utf8');
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
        res.status(500).json({ error: 'Failed to generate PDF' });
    }
});

module.exports = router;