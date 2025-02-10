// routes/pdf.js
import queueService from './queue-service';
import pdfService from './pdf-service';
const express = require('express');
const router = express.Router();

// routes/pdf.js
router.post('/preview-pdf', async (req, res) => {
    try {
        const { templateName, data, language } = req.body;
        const html = await pdfService.generatePreviewHtml(
            templateName,
            data,
            language
        );
        res.send(html);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/generate-pdf', async (req, res) => {
    try {
        const { templateName, data, language } = req.body;
        const job = await queueService.addPDFJob(templateName, data, language);
        res.json({ jobId: job.id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/pdf-status/:jobId', async (req, res) => {
    try {
        const job = await queueService.pdfQueue.getJob(req.params.jobId);

        if (!job) {
            return res.status(404).json({ error: 'Job not found' });
        }

        const state = await job.getState();
        const progress = job.progress();

        if (state === 'completed') {
            const { pdfPath } = job.returnvalue;
            const pdfUrl = `/temp/${path.basename(pdfPath)}`;
            res.json({ completed: true, progress: 100, pdfUrl });
        } else if (state === 'failed') {
            res.json({ completed: true, progress: 100, error: job.failedReason });
        } else {
            res.json({ completed: false, progress });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});