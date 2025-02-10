// translation-service.js
const { Translate } = require('@google-cloud/translate').v2;
const fs = require('fs').promises;

// translation-service.js
class TranslationService {
    constructor(cacheService) {
        this.cacheService = cacheService;
        this.translator = new Translate({
            projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
            keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
        });
        // Load static translations when service starts
        this.staticTranslations = {};
        this.loadStaticTranslations();
    }

    async translateWithRetry(text, targetLanguage, attempts = 3) {
        for (let i = 0; i < attempts; i++) {
            try {
                // Check cache first
                const cachedTranslation = await this.cacheService
                    .getCachedTranslation(text, targetLanguage);

                if (cachedTranslation) {
                    return cachedTranslation;
                }

                // Perform translation
                const [translation] = await this.translator
                    .translate(text, targetLanguage);

                // Cache successful translation
                await this.cacheService
                    .setCachedTranslation(text, targetLanguage, translation);

                return translation;
            } catch (error) {
                if (i === attempts - 1) throw error;

                // Exponential backoff
                const delay = Math.pow(2, i) * 1000;
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    }

    // This is where translateDynamicContent is defined
    async translateDynamicContent(text, targetLanguage) {
        try {
            // First check cache
            const cachedTranslation = await this.cacheService
                .getCachedTranslation(text, targetLanguage);

            if (cachedTranslation) {
                return cachedTranslation;
            }

            // If not in cache, translate using Google Translate
            const [translation] = await this.translator.translate(text, targetLanguage);

            // Cache the translation for future use
            await this.cacheService.setCachedTranslation(
                text,
                targetLanguage,
                translation
            );

            return translation;
        } catch (error) {
            console.error('Translation error:', error);
            throw error;
        }
    }

    // This is where getStaticTranslations is defined
    getStaticTranslations(language) {
        // Return translations for the requested language
        return this.staticTranslations[language] || {};
    }

    // Helper method to load static translations from files
    async loadStaticTranslations() {
        try {
            // Load translations for each supported language
            const hindi = await fs.readFile(
                path.join(__dirname, 'translations', 'hindi.json'),
                'utf8'
            );
            this.staticTranslations.hi = JSON.parse(hindi);

            // Add more languages as needed
        } catch (error) {
            console.error('Error loading static translations:', error);
        }
    }
}

export default TranslationService;