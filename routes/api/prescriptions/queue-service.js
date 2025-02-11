// queue-service.js
const Queue = require('bull');
const path = require('path');
const fs = require('fs').promises;

class QueueService {
    constructor(pdfService) {
        // This creates the pdfQueue that's used throughout the service
        this.pdfQueue = new Queue('pdf-generation', {
            redis: {
                host: process.env.REDIS_HOST || 'redis-service',
                port: process.env.REDIS_PORT || 6379
            }
        });

        this.pdfService = pdfService;
        this.setupQueueHandlers();
    }

    setupQueueHandlers() {
        // This is where this.pdfQueue.process is defined
        this.pdfQueue.process(async (job) => {
            const { templateName, data, language } = job.data;

            try {
                // Update progress as we go
                await job.progress(10);

                const pdf = await this.pdfService.generatePDF(
                    templateName,
                    data,
                    language,
                    (progress) => job.progress(progress)
                );

                // Store the generated PDF temporarily
                const pdfPath = path.join(
                    this.pdfService.tempDir,
                    `${job.id}-${Date.now()}.pdf`
                );
                await fs.writeFile(pdfPath, pdf);

                return { pdfPath };
            } catch (error) {
                throw new Error(`PDF generation failed: ${error.message}`);
            }
        });

        // This is where this.pdfQueue.on is defined
        this.pdfQueue.on('failed', async (job, error) => {
            console.error(`Job ${job.id} failed:`, error);

            // attemptsMade is a property provided by Bull for each job
            if (job.attemptsMade < 3) {
                await job.retry();
            }
        });
    }

    async addPDFJob(templateName, data, language) {
        return await this.pdfQueue.add(
            { templateName, data, language },
            {
                attempts: 3,
                backoff: {
                    type: 'exponential',
                    delay: 1000
                }
            }
        );
    }
}

export default QueueService;