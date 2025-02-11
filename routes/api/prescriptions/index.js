import Authenticated from "../middleware/auth";
import PdfService from '../../../app/services/prescriptions/pdfService';

const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const { raiseClientError } = require("../helper");
const CarePlanWrapper = require("../../../app/apiWrapper/web/carePlan");
const moment = require("moment/moment");
const { compileTemplate } = require('./templateCompiler');
const tasks = new Map(); // Using Map for better performance

const { translateText, generatePDF } = new PdfService();

// router.post('/generate-pdf/:care_plan_id', Authenticated, async (req, res) => {
//     const { lang, data } = req.body;
//     const taskId = uuidv4();
//
//     const {care_plan_id = null} = req.params;
//     if (!care_plan_id) {
//         return raiseClientError(res, 422, {}, "Invalid Care Plan!");
//     }
//
//     // Store task in progress
//     tasks[taskId] = { status: 'processing', progress: 0 };
//
//     // Async processing
//     setTimeout(async () => {
//         try {
//             const translatedData = await translateData(data, lang, (progress) => {
//                 tasks[taskId].progress = progress;
//             });
//             const html = compileTemplate(translatedData);
//             const pdf = await generatePDF(html);
//             tasks[taskId] = { status: 'completed', pdf };
//         } catch (error) {
//             tasks[taskId] = { status: 'failed', error };
//         }
//     }, 0);
//
//     res.json({ taskId });
// });

// backend/routes.js
router.post('/generate-pdf/:care_plan_id', Authenticated, async (req, res) => {
    try {
        const {lang, templateName, data} = req.body;
        const taskId = uuidv4();

        const {care_plan_id = null} = req.params;
        if (!care_plan_id) {
            return raiseClientError(res, 422, {}, "Invalid Care Plan!");
        }

        // Initialize task
        tasks.set(taskId, {
            status: 'processing',
            progress: 0,
            createdAt: Date.now()
        });

        // Process in background
        process.nextTick(async () => {
            try {
                // 1. Translate data
                const translatedData = await translateText(data, lang, (progress) => {
                    const task = tasks.get(taskId);
                    task.progress = Math.min(progress, 0.95); // Reserve 5% for PDF generation
                    tasks.set(taskId, task);
                });

                // 2. Compile template
                const html = compileTemplate(templateName, translatedData);

                // 3. Generate PDF
                const pdf = await generatePDF(html);

                // 4. Update task
                tasks.set(taskId, {
                    status: 'completed',
                    pdf,
                    completedAt: Date.now()
                });
            } catch (error) {
                tasks.set(taskId, {
                    status: 'failed',
                    error: error.message,
                    failedAt: Date.now()
                });
            }
        });

        res.json({taskId});
    } catch (error) {
        res.status(500).json({error: 'Failed to start generation'});
    }
});

router.get('/task/:taskId', (req, res) => {
    const task = tasks[ req.params.taskId ];
    res.json(task);
});

// Add this endpoint for download
router.get('/download/:taskId', (req, res) => {
    try {
        const task = tasks.get(req.params.taskId);
        if (!task || task.status !== 'completed') {
            return res.status(404).send('PDF not found');
        }

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=document.pdf`);
        res.send(task.pdf);
    } catch (error) {
        res.status(500).send('Download failed');
    }
});

module.exports = router;