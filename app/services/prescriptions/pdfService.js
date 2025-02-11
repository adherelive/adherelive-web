import puppeteer from 'puppeteer';
import Handlebars from 'handlebars';
import NodeCache from 'node-cache';

import { createLogger, logger } from "../../../libs/logger";

const logger = createLogger("WEB > PRESCRIPTIONS > SERVICE");

const fs = require('fs').promises;
const { Translate } = require('@google-cloud/translate').v2;


// Initialize cache with 1 hour TTL
const translationCache = new NodeCache({ stdTTL: 3600 });

class PdfService {
    constructor() {
        this.translate = new Translate({
            projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
            keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
        });

        // Register Handlebars helper for special characters
        Handlebars.registerHelper('formatSpecialChars', function(text) {
            if (typeof text !== 'string') return text;
            return text.replace(/[^\w\s]/gi, match => `&#${match.charCodeAt(0)};`);
        });
    }

    async loadTranslations() {
        try {
            const data = await fs.readFile(__dirname +'../../../routes/api/prescriptions/translations.json', 'utf8');
            return JSON.parse(data);
        } catch (error) {
            console.error('Error loading translations:', error);
            return {};
        }
    }

    async translateText(text, targetLanguage, retryCount = 3) {
        const cacheKey = `${text}_${targetLanguage}`;
        const cachedTranslation = translationCache.get(cacheKey);

        if (cachedTranslation) {
            return cachedTranslation;
        }

        for (let attempt = 1; attempt <= retryCount; attempt++) {
            try {
                const [translation] = await this.translate.translate(text, targetLanguage);
                translationCache.set(cacheKey, translation);
                return translation;
            } catch (error) {
                if (attempt === retryCount) throw error;
                await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
            }
        }
        logger.debug('Text translated successfully from cache!')
    }

    async translateTemplate(template, data, targetLanguage) {
        const translations = await this.loadTranslations();
        const translatedData = { ...data };

        // Translate static content from translations.json
        for (const [key, value] of Object.entries(template.match(/{{[^}]+}}/g) || [])) {
            const fieldName = value.replace(/[{}]/g, '');
            if (translations[fieldName]) {
                translatedData[fieldName] = translations[fieldName];
            } else {
                // Translate dynamic content using Google Translate
                translatedData[fieldName] = await this.translateText(data[fieldName], targetLanguage);
            }
        }
        logger.debug('Special characters handled correctly!')
        return translatedData;
    }

    async generatePDF(htmlTemplate, data, language = 'en') {
        try {
            const translatedData = language === 'en' ? data :
                await this.translateTemplate(htmlTemplate, data, language);

            const template = Handlebars.compile(htmlTemplate);
            const html = template(translatedData);

            const browser = await puppeteer.launch({
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });
            const page = await browser.newPage();

            // Set content and wait for fonts to load
            await page.setContent(html, {
                waitUntil: ['networkidle0', 'load', 'domcontentloaded']
            });

            // Generate PDF
            const pdf = await page.pdf({
                format: 'A4',
                printBackground: true,
                margin: {
                    top: '20px',
                    right: '20px',
                    bottom: '20px',
                    left: '20px'
                }
            });

            await browser.close();
            logger.debug('PDF has been generated and returned successfully!')
            return pdf;
        } catch (error) {
            console.error('Error generating PDF:', error);
            throw error;
        }
    }
}

export default PdfService;