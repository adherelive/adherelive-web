/**
 * README:
 *
 * Structure:
 * - The template uses {{strings.xxx}} for all static text, making it easy to switch languages
 * - Dynamic data uses simple {{variable}} syntax for single values
 * - {{#each}} blocks for arrays and nested data
 * - Maintained semantic HTML structure with proper sections
 *
 * Key features of this approach:
 * - Language Switching:
 * - All static text is referenced through strings object
 * - Change language by switching the strings property in the data object
 * - Can load language files dynamically from JSON
 *
 * Dynamic Data:
 * - Supports single values ({{userData.name}})
 * - Arrays with {{#each}} loops
 * - Nested data structures (products with variants)
 * - Table generation from arrays
 *
 * Flexibility:
 * - Easy to add new sections
 * - Can handle different data types
 * - Maintains clean separation between structure and content
 */
import { createLogger } from "../../../libs/logger";
import fs from "fs";
import mongoose from "mongoose";
import Handlebars from 'handlebars';

const {Translate} = require('@google-cloud/translate').v2;

// MongoDB Schema for translations
const TranslationSchema = new mongoose.Schema({
    key: { type: String, required: true },
    sourceLanguage: { type: String, required: true },
    targetLanguage: { type: String, required: true },
    sourceText: { type: String, required: true },
    translatedText: { type: String, required: true },
    context: { type: String, default: 'static' }, // 'static' or 'dynamic'
    lastUsed: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Create a compound index for efficient lookups
TranslationSchema.index({
    key: 1,
    sourceLanguage: 1,
    targetLanguage: 1
}, { unique: true });

const Translation = mongoose.model('Translation', TranslationSchema);

// Translation service setup
const translate = new Translate({
    projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
    keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

const logger = createLogger("ENHANCED TRANSLATION API");

// Read and compile template
const template = fs.readFileSync(__dirname + '/prescription_with_handlebars.html', 'utf-8');
// Read and parse the JSON file
const medicalData = JSON.parse(fs.readFileSync(__dirname + '/prescription_patient_data.json', 'utf-8'));
const compiledTemplate = Handlebars.compile(template);

// Cache for translations to reduce API calls
const translationCache = new Map();
logger.info(`Translation Cache has data: ${translationCache}`);

// Language strings (can be loaded from JSON files)
const staticTranslatedDataStrings = require('../../../other/prescriptions/test.json');

// As the browsers and Google Translate does not do this
// const devanagariDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];

/**
 * Register the print helper
 * This helps in the 'print' statements in the handlebars for the HTML file
 */
Handlebars.registerHelper('print', function(value) {
    return value + 1;
});

// TODO: Use Redis, To cache & fetch the cached data from Redis

/**
 * Helper function for language code normalization
 *
 * @param langCode
 * @returns {*}
 */
function normalizeLanguageCode(langCode) {
    const languageMap = {
        'hi-Latn': 'en', 	// Map Latin script Hindi to English
        'und': 'en',     	// Map undefined language to English
        'undefined': 'en',	// Map undefined language to English
        'mr': 'hi'       	// Map Marathi to Hindi if needed
    };

    return languageMap[ langCode ] || langCode;
}

/**
 * Helper function for detecting incompatible language pairs
 *
 * @param source
 * @param target
 * @returns {boolean}
 */
function isIncompatibleLanguagePair(source, target) {
    const incompatiblePairs = [
        ['hi-Latn', 'hi'],
        ['und', 'hi']
    ];

    return incompatiblePairs.some(([s, t]) =>
        s === source && t === target
    );
}

/**
 * Enhanced language detection with fallback
 *
 * @param text
 * @returns {Promise<string|null>}
 */
async function detectLanguageWithFallback(text) {
    try {
        const [detection] = await translate.detect(text);

        // Validate the detected language
        if (!detection || !detection.language) {
            logger.warn(`Invalid language detection result for: ${text}`);
            return null;
        }

        // Log the detected language for debugging
        logger.debug(`Detected language: ${detection.language} (confidence: ${detection.confidence})`);

        return detection.language;
    } catch (error) {
        logger.error(`Language detection failed: ${error.message}`);
        return null;
    }
}

/**
 * Function to check and retrieve translation from MongoDB.
 * This fetches all the previously translated [missing] words, that were stored in the DB from previous runs
 *
 * @param key
 * @param sourceLanguage
 * @param targetLanguage
 * @returns {Promise<*|null>}
 */
async function getStoredTranslation(key, sourceLanguage, targetLanguage) {
    try {
        const storedTranslation = await Translation.findOne({
            key,
            sourceLanguage,
            targetLanguage
        });

        if (storedTranslation) {
            // Update last used timestamp
            await Translation.updateOne(
                {_id: storedTranslation._id},
                {$set: {lastUsed: new Date()}}
            );
            return storedTranslation.translatedText;
        }

        return null;
    } catch (error) {
        logger.error(`Error retrieving translation using findOne '${key}' from MongoDB: `, error);
        return null;
    }
}

/**
 * Enhanced translation function with language detection
 *
 * @param text
 * @param sourceLanguage
 * @param targetLanguage
 * @returns {Promise<{sourceLanguage: (string|string), sourceText, translatedText: string}|{sourceLanguage, sourceText, translatedText}|{sourceLanguage: (string|string), sourceText, translatedText}>}
 */
async function translateWithDetection(text, sourceLanguage, targetLanguage) {
    // Early validation of input
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
        logger.warn(`Invalid or empty text provided for translation: '${text}'`);
        return {
            sourceLanguage: sourceLanguage || 'en',
            sourceText: text || '',
            translatedText: text || ''
        };
    }

    // Skip translation for numbers, identifiers, etc.
    if (shouldSkipTranslation(text)) {
        return {
            sourceLanguage: sourceLanguage || 'en',
            sourceText: text,
            translatedText: text
        };
    }

    try {
        // Detect the language of the input text, with validation
        const detectedLanguage = await detectLanguageWithFallback(text);

        // Use provided sourceLanguage as fallback if detection fails
        const confirmedSourceLang = normalizeLanguageCode(detectedLanguage || sourceLanguage || 'en');

        // If text is already in target language, return as is
        if (confirmedSourceLang === targetLanguage) {
            return {
                sourceLanguage: confirmedSourceLang,
                sourceText: text,
                translatedText: text
            };
        }

        // Check for incompatible language pairs
        if (isIncompatibleLanguagePair(confirmedSourceLang, targetLanguage)) {
            logger.warn(`Incompatible language pair detected: ${confirmedSourceLang} -> ${targetLanguage}`);
            return {
                sourceLanguage: confirmedSourceLang,
                sourceText: text,
                translatedText: text // Return original text for incompatible pairs
            };
        }

        // Enhanced retry logic with rate limiting
        let result;
        try {
            result = await retryWithRateLimit(
                async () => {
                    const [translation] = await translate.translate(text, {
                            from: confirmedSourceLang,
                            to: targetLanguage
                        }
                    );
                    return translation;
                },
                {
                    maxRetries: 2,
                    baseDelay: 1000,
                    maxDelay: 5000
                }
            );
        } catch (error) {
            // If all retries failed, log error and return original text
            logger.error(`Translation failed after '2' attempts - '${confirmedSourceLang}', '${targetLanguage}', & '${text}': `, error);
            result = text; // Fallback to original text
        }
        return {
            sourceLanguage: confirmedSourceLang,
            sourceText: text,
            translatedText: result || text // Fallback to original text if translation fails
        };

    } catch (error) {
        logger.error(`Translation with detection failed - '${sourceLanguage}', '${targetLanguage}', & '${text}': `, error);
        return {
            sourceLanguage: sourceLanguage || 'en',
            sourceText: text,
            translatedText: text // Fallback to original text
        };
    }
}

/**
 * Function to store translation in MongoDB
 *
 * @param key
 * @param sourceLanguage
 * @param targetLanguage
 * @param sourceText
 * @param translatedText
 * @param context
 * @returns {Promise<void>}
 */
async function storeTranslation(key, sourceLanguage, targetLanguage, sourceText, translatedText, context = 'static') {
    try {
        // Ensure we're not storing identical source and translated text when languages differ
        if (sourceLanguage !== targetLanguage && sourceText === translatedText) {
            logger.warn(`Attempt to store identical [${sourceText}|${translatedText}] text: ${sourceLanguage} -> ${targetLanguage}`);
            logger.warn(`Skipping storage of identical texts: ${sourceText}`);
            return;
        }

        try {
            await Translation.findOneAndUpdate(
                {
                    key,
                    sourceLanguage,
                    targetLanguage
                },
                {
                    sourceText,
                    translatedText,
                    context,
                    updatedAt: new Date(),
                    lastUsed: new Date()
                },
                {
                    upsert: true,
                    new: true
                }
            );
        } catch (error) {
            logger.error(`MongoDB storage error: ${error.message}`);
        }
    } catch (error) {
        logger.error(`Error storing translation '${translatedText}' in MongoDB: `, error);
    }
}

/**
 * Helper function to handle dynamic content translation with MongoDB
 *
 * @param content
 * @param sourceLanguage
 * @param targetLanguage
 * @returns {Promise<Awaited<unknown>[]|{}|*|string>}
 */
async function translateDynamicContent(content, sourceLanguage, targetLanguage) {
    if (!content) return content;

    if (typeof content === 'string') {
        // Skip translation for certain content
        if (shouldSkipTranslation(content)) {
            return content;
        }

        try {
            // Generate a unique key for dynamic content
            const contentKey = `dynamic_${Buffer.from(content).toString('base64')}`;

            // Check MongoDB cache first
            const storedTranslation = await getStoredTranslation(
                contentKey,
                sourceLanguage,
                targetLanguage
            );

            if (storedTranslation) {
                return storedTranslation;
            }

            // If not found, detect language and translate, with error handling
            const {sourceLanguage, sourceText, translatedText} = await translateWithDetection(
                content,
                sourceLanguage,
                targetLanguage
            );
            logger.debug(`Source text obtained is: ${sourceText}`);

            // Store successful translation
            if (translatedText !== content) {
                await storeTranslation(
                    contentKey,
                    sourceLanguage,
                    targetLanguage,
                    content,
                    translatedText,
                    'dynamic'
                );
            }

            return translatedText;
        } catch (error) {
            logger.error(`Dynamic translation failed '${content}': `, error);
            return content; // Fallback to original content
        }
    }

    // Handle arrays and objects recursively
    if (Array.isArray(content)) {
        const results = await Promise.allSettled(
            content.map(item => translateDynamicContent(item, sourceLanguage, targetLanguage))
        );

        return results.map(result =>
            result.status === 'fulfilled' ? result.value : content
        );
    }

    if (content && typeof content === 'object') {
        const translatedObj = {};
        for (const [key, value] of Object.entries(content)) {
            translatedObj[ key ] = await translateDynamicContent(
                value,
                sourceLanguage,
                targetLanguage
            );
        }
        return translatedObj;
    }

    return content;
}

/**
 * Skip translation for these cases, with enhancements
 *
 * @param content
 * @returns {boolean}
 */
function shouldSkipTranslation(content) {
    if (!content || typeof content !== 'string') return true;

    const skipPatterns = {
        empty: /^\s*$/,  // Empty or whitespace
        email: /@/, // Email addresses
        url: /^(https?:\/\/)/i, //URLs
        uuid: /^[A-F0-9-]{36}$/i, //UUIDs
        identifier: /^[A-Z0-9_-]{8,}$/i, // IDs and other codes
        handlebars: /{{\s*[\w.]+\s*}}/, // Handlebars expressions
        // pureNumber: /^\d+$/, // Pure numbers
        specialCharacters: /^[^a-zA-Z\u0900-\u097F\u0600-\u06FF\u4E00-\u9FFF\u3040-\u30FF]+$/
    };

    return Object.values(skipPatterns).some(pattern => pattern.test(content));
}

/**
 * Utility function to clean up old translations in the mongo DB
 *
 * @param daysOld
 * @returns {Promise<void>}
 */
export async function cleanupOldTranslations(daysOld = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    try {
        const result = await Translation.deleteMany({
            lastUsed: {$lt: cutoffDate}
        });
        logger.info(`Cleaned up '${result.deletedCount}' old translations`);
    } catch (error) {
        logger.error('Error cleaning up old translations: ', error);
    }
}

/**
 * Translation validations with UNICODE for the language used
 *
 * @param original
 * @param translated
 * @param language
 * @returns {boolean}
 */
function validateTranslation(original, translated, language) {
    // Basic validation
    if (!translated || typeof translated !== 'string') {
        throw new Error('Invalid translation: Empty or not a string');
    }

    // Check for template markers
    if (translated.includes('{{') || translated.includes('}}')) {
        throw new Error('Translation still contains the template markers');
    }

    // Language-specific validations
    const validations = {
        hi: {
            regex: /[\u0900-\u097F]/,
            message: 'Hindi translation must contain Hindi characters'
        },
        ar: {
            regex: /[\u0600-\u06FF]/,
            message: 'Arabic translation must contain Arabic characters'
        },
        zh: {
            regex: /[\u4E00-\u9FFF]/,
            message: 'Chinese translation must contain Chinese characters'
        },
        ja: {
            regex: /[\u3040-\u309F\u30A0-\u30FF]/,
            message: 'Japanese translation must contain Japanese characters'
        }
    };

    if (validations[ language ]) {
        if (!validations[ language ].regex.test(translated)) {
            throw new Error(validations[ language ].message);
        }
    }

    // Length validation (translation shouldn't be extremely longer/shorter than original)
    const lengthRatio = translated.length / original.length;
    if (lengthRatio < 0.2 || lengthRatio > 3) {
        throw new Error('Translation length seems unusual');
    }

    return true;
}

/**
 * Function to get the translations from local strings only, which are stored in the web.json file
 *
 * @param sourceLanguage
 * @param targetLanguage
 * @param staticTranslatedDataStrings
 * @returns {Promise<{}>}
 */
async function getTranslations(sourceLanguage, targetLanguage, staticTranslatedDataStrings) {
    // Create a complete strings object with fallback to translation API
    const translatedStrings = {};
    const [translation] = [];

    // Get all string keys from HTML template
    const templateKeys = extractKeysFromTemplate(__dirname + '/prescription_with_handlebars.html');

    for (const key of templateKeys) {
        try {
            // TODO: Use Redis, Check cache first

            // Check if any of the translations exists in local JSON file of pre-created translations
            if (staticTranslatedDataStrings[ targetLanguage ]?.[ key ]) {
                translatedStrings[ key ] = staticTranslatedDataStrings[ targetLanguage ][ key ];
                continue;
            }

            // Check if any of the translation exists in MongoDB, from previous translations
            const storedTranslation = await getStoredTranslation(key, sourceLanguage, targetLanguage);
            if (storedTranslation) {
                translatedStrings[ key ] = storedTranslation;
                continue;
            }

            // If not found, get source text from source langauge static data (e.g., English)
            const sourceText = staticTranslatedDataStrings[ sourceLanguage ]?.[ key ] || key;

            // Translate with language detection, sourceLanguage value returned becomes the detectedSource
            const {
                sourceLang: detectedSource,
                sourceTranslate,
                translatedText
            } = await translateWithDetection(sourceText, sourceLanguage, targetLanguage);

            if (!sourceTranslate && sourceText.length <= 0) {
                [translation] = await translate.translate(sourceText, targetLanguage);
            }

            // Store the new translation in MongoDB
            await storeTranslation(
                key,
                detectedSource,
                targetLanguage,
                sourceText,
                translatedText
            );

            translatedStrings[ key ] = translatedText;

            // Update in-memory strings object
            if (!staticTranslatedDataStrings[ targetLanguage ]) {
                staticTranslatedDataStrings[ targetLanguage ] = {};
            }
            staticTranslatedDataStrings[ targetLanguage ][ key ] = translation;

            // TODO: Use Redis, Cache result

        } catch (error) {
            logger.error(`Translation failed for key '${key}': `, {
                error,
                sourceLanguage,
                targetLanguage,
                text: staticTranslatedDataStrings[ sourceLanguage ]?.[ key ]
            });
            // Fallback to source language text or the key itself
            translatedStrings[ key ] = staticTranslatedDataStrings[ sourceLanguage ]?.[ key ] || key;
        }
    }
    logger.debug(`Get Translated Strings: \n ${translatedStrings}`);
    return translatedStrings;
}

/**
 * Helper function to extract translation keys from template
 *
 * @param templatePath
 * @returns {any[]}
 */
function extractKeysFromTemplate(templatePath) {
    const template = fs.readFileSync(templatePath, 'utf-8');
    const stringKeys = new Set();

    // Regular expression to find all {{strings.xxx}} patterns
    const regex = /{{strings\.([^}]+)}}/g;
    let match;

    while (( match = regex.exec(template) ) !== null) {
        stringKeys.add(match[ 1 ]);
    }

    return Array.from(stringKeys);
}

/**
 * Function to sanitize circular references
 *
 * @param obj
 * @returns {any}
 */
function sanitizeData(obj) {
    const seen = new WeakSet();
    return JSON.parse(JSON.stringify(obj, (key, value) => {
        if (typeof value === 'object' && value !== null) {
            if (seen.has(value)) {
                return '[Circular Reference]';
            }
            seen.add(value);
        }
        return value;
    }));
}

/**
 * Function to flatten the medical data structure
 *
 * @param medicalDataFromJSON
 * @param strings
 * @returns {{strings, medicalData: *}}
 */
function prepareTemplateData(medicalDataFromJSON, strings) {
    // Sanitize the medical data
    const sanitizedData = sanitizeData(medicalDataFromJSON);

    // Create the base dynamic data object with all top-level properties
    const dynamicData = {
        strings,
        // Spread all top-level properties
        ...sanitizedData,
        // Keep the full medical data structure for reference
        medicalData: sanitizedData
    };
    return dynamicData;
}

/**
 * Retry function with rate limiting for the Google API
 *
 * @param fn
 * @param options
 * @returns {Promise<*>}
 */
async function retryWithRateLimit(fn, options) {
    const {maxRetries = 3, baseDelay = 1000, maxDelay = 5000} = options;
    let attempt = 0;
    let delay = baseDelay;

    while (attempt < maxRetries) {
        try {
            return await fn();
        } catch (error) {
            attempt++;

            if (error.code === 429 || error.message.includes('RESOURCE_EXHAUSTED')) {
                // Exponential backoff for rate limits
                delay = Math.min(delay * 2, maxDelay);
                logger.warn(`Rate limit hit, retrying in ${delay}ms (attempt ${attempt}/${maxRetries})`);
                await new Promise(resolve => setTimeout(resolve, delay));
                continue;
            }

            // For other errors, throw if it's the last attempt
            if (attempt === maxRetries) {
                throw error;
            }

            // Linear backoff for other errors
            delay = baseDelay;
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }

    throw new Error(`Failed after ${maxRetries} attempts`);
}

/**
 * Function to replace all values in the dynamic data and HTML fields using handlebars
 *
 * @param targetLanguage
 * @returns {Promise<string>}
 */
export async function renderTemplate(targetLanguage) {
    try {
        // Store the source language
        let sourceLangauge = 'en';

        // Get translations for static content
        const strings = await getTranslations(sourceLangauge, targetLanguage, staticTranslatedDataStrings);

        // Prepare data with automatic flattening of arrays
        const dynamicData = prepareTemplateData(medicalData, strings);

        // TODO: this is the other method used to segregate the string and numbers. Remove it.
        // Translate dynamic content
        // const translatedDynamicData = await handleContentTranslation(dynamicData, targetLanguage);

        // Translate dynamic content recursively
        const translatedDynamicData = await translateDynamicContent(
            dynamicData,
            sourceLangauge,
            targetLanguage
        );

        // Merge strings and translated data
        const data = {
            strings,
            ...translatedDynamicData // Spread the translated data into the main data object
        };

        // Validate that the handlebars have been properly translated
        //const validLangaugeData = validateTranslation(dynamicData, data, sourceLangauge);
        // return the compiled data, if the above response is true

        logger.info(`Data Conversion completed. PDF has been generated and displayed in ${targetLanguage}`);
        // TODO: Clean-up the mongoDB of translations older than 45 days!
        await cleanupOldTranslations(45);

        // Render template
        return compiledTemplate(data);
    } catch (error) {
        logger.error(`Template rendering failed for language ${targetLanguage}: `, error);
        // Fallback to English
        return compiledTemplate({...data, strings: staticTranslatedDataStrings.en});
    }
}

// Export the enhanced functions
module.exports = { renderTemplate };