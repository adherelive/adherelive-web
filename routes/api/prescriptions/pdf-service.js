// pdf-service.js
import translationService from './translation-service';

const puppeteer = require('puppeteer');
const Handlebars = require('handlebars');
const fs = require('fs').promises;
const fsx = require('fs-extra');
const path = require('path');

class PDFService {
    constructor(translationService) {
        // Ensure temp directory exists in container
        this.tempDir = process.env.TEMP_DIR || '/tmp/pdfs';
        fsx.ensureDirSync(this.tempDir);

        this.translationService = translationService;
    }

    async generatePDF(templateName, data, language = 'en') {
        // Read template
        const template = await fs.readFile(`templates/${templateName}.hbs`, 'utf8');

        // If language is not English, translate dynamic content
        if (language !== 'en') {
            const translatedData = await this.translateData(data, language);
            data = {
                ...translatedData,
                ...this.translationService.getStaticTranslations(language)
            };
        }

        // Compile template with translated data
        const compiledTemplate = Handlebars.compile(template);
        const html = compiledTemplate(data);

        // Generate PDF using Puppeteer
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setContent(html);

        const pdf = await page.pdf({
            format: 'A4',
            printBackground: true
        });

        await browser.close();
        return pdf;
    }

    async translateData(data, targetLanguage) {
        const translatedData = {};

        for (const [key, value] of Object.entries(data)) {
            if (typeof value === 'string') {
                translatedData[key] = await this.translationService
                    .translateDynamicContent(value, targetLanguage);
            } else {
                translatedData[key] = value;
            }
        }

        return translatedData;
    }

    // This is where generatePreviewHtml is defined
    async generatePreviewHtml(templateName, data, language) {
        try {
            // Read the template
            const template = await fs.readFile(
                path.join(__dirname, 'templates', `${templateName}.hbs`),
                'utf8'
            );

            // Translate content if needed
            let translatedData = data;
            if (language !== 'en') {
                translatedData = await this.translateData(data, language);
                // Merge with static translations
                translatedData = {
                    ...translatedData,
                    ...this.translationService.getStaticTranslations(language)
                };
            }

            // Compile and return the HTML
            const compiledTemplate = Handlebars.compile(template);
            return compiledTemplate(translatedData);
        } catch (error) {
            console.error('Error generating preview:', error);
            throw error;
        }
    }

    async cleanupOldFiles() {
        // Implement cleanup of old temporary files
        const files = await fs.readdir(this.tempDir);
        const now = Date.now();

        for (const file of files) {
            const filePath = path.join(this.tempDir, file);
            const stats = await fs.stat(filePath);

            // Remove files older than 1 hour
            if (now - stats.mtimeMs > 3600000) {
                await fs.unlink(filePath);
            }
        }
    }
}

export default PDFService;