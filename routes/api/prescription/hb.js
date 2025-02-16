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
    projectId: process.config.google_keys.GOOGLE_CLOUD_PROJECT_ID,
    keyFilename: process.config.google_keys.GOOGLE_APPLICATION_CREDENTIALS,
});

const logger = createLogger("ENHANCED TRANSLATION API");

// Read and compile template
const template = fs.readFileSync(__dirname + '/p.html', 'utf-8');
// Read and parse the JSON file
const medicalData = JSON.parse(fs.readFileSync(__dirname + '/patient.json', 'utf-8'));
const compiledTemplate = Handlebars.compile(template);

// Cache for translations to reduce API calls
const translationCache = new Map();
logger.info(`Translation Cache has data: ${translationCache}`);

export const localeMap = {
    'hi': 'hi-IN',   // Hindi (India)
    'es': 'es-ES',   // Spanish (Spain)
    'ja': 'ja-JP',   // Japanese
    'zh': 'zh-CN',   // Chinese (Simplified)
    'ar': 'ar-SA',   // Arabic (Saudi Arabia)
    // Add more mappings as needed
};

// Language strings (can be loaded from JSON files)
const staticTranslatedDataStrings = require('../../../other/test.json');

// As the browsers and Google Translate does not do this
const devanagariDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];

/**
 * Register the print helper
 *
 */
Handlebars.registerHelper('print', function(value) {
    return value + 1;
});

/**
 * For getting and converting the target language to a locale, for use with Google Translation API
 *
 * @param language
 * @returns {*}
 */
const getLocale = (language) => {
    try {
        // If a full locale is provided (e.g., 'hi-IN'), return it as is
        if (language.includes('-')) {
            let baseLang = language.split('-')[ 0 ].split('_')[ 0 ];
            if (baseLang === 'hi') {
                language = 'hi-IN';
            }
            return language;
        }

        // If only language code is provided, get the mapped locale
        return localeMap[ language ] || language;
    } catch (error) {
        logger.error(`Error getting locale for language '${language}': `, error);
        return language;
    }
};

/**
 * Function to detect the language being used for a specific content/data
 *
 * @param text
 * @returns {Promise<string|null>}
 */
async function detectLanguage(text) {
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
        return null;
    }

    const maxRetries = 2;
    let attempt = 0;

    while (attempt < maxRetries) {
        try {
            const [detection] = await translate.detect(text);
            return (detection.language);
        } catch (error) {
            attempt++;

            if (error.code === 429) {
                const delay = Math.pow(2, attempt) * 1000;
                await new Promise(resolve => setTimeout(resolve, delay));
                continue;
            }

            logger.error(`Language detection failed for '${text}': `, error);
            return null;
        }
    }

    return null;
}

/**
 * Manually converting numbers to Devanagari/Hindi
 *
 * @param number
 * @returns {string}
 */
function convertNumberToDevanagari(number) {
    const numStr = number.toString();
    let devanagariStr = '';
    for (let i = 0; i < numStr.length; i++) {
        const digit = parseInt(numStr[ i ]);
        if (!isNaN(digit)) {
            devanagariStr += devanagariDigits[ digit ];
        } else {
            devanagariStr += numStr[ i ]; // Keep non-digit characters as is
        }
    }
    return devanagariStr;
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

    try {
        // Detect the language of the input text
        const detectedLanguage = await detectLanguage(text);

        // Use provided sourceLanguage as fallback if detection fails
        const confirmedSourceLang = detectedLanguage || sourceLanguage || 'en';

        // If text is already in target language, return as is
        if (confirmedSourceLang === targetLanguage) {
            return {
                sourceLanguage: confirmedSourceLang,
                sourceText: text,
                translatedText: text
            };
        }

        // Implement retry logic with exponential backoff
        const maxRetries = 2;
        let attempt = 0;
        let lastError;

        while (attempt < maxRetries) {
            try {
                const [translation] = await translate.translate(text, {
                    from: confirmedSourceLang,
                    to: targetLanguage
                });

                return {
                    sourceLanguage: confirmedSourceLang,
                    sourceText: text,
                    translatedText: translation
                };
            } catch (error) {
                lastError = error;
                attempt++;

                // Check if it's a rate limit error
                if (error.code === 429) {
                    const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
                    await new Promise(resolve => setTimeout(resolve, delay));
                    continue;
                }

                // For other errors, break the retry loop
                break;
            }
        }

        // If all retries failed, log error and return original text
        logger.error(`Translation failed after '${maxRetries}' attempts - '${confirmedSourceLang}', '${targetLanguage}', & '${text}': `, lastError);
        return {
            sourceLanguage: confirmedSourceLang,
            sourceText: text,
            translatedText: text // Fallback to original text
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
            return;
        }

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

// Skip translation for these cases
function shouldSkipTranslation(content) {
    if (!content || typeof content !== 'string') return true;

    return (
        content.trim().length === 0 || // Empty or whitespace
        content.includes('@') || // Email addresses
        // /^[0-9]+$/.test(content) || // Pure numbers
        /^((http|https)?:\/\/)/.test(content) || // URLs
        /{{\s*[\w.]+\s*}}/.test(content) || // Handlebars expressions
        /^[A-F0-9-]{36}$/i.test(content) || // UUIDs
        /^[A-Z0-9]{8,}$/i.test(content) // IDs and other codes
    );
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
        throw new Error('Translation contains template markers');
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
 * Number formatter for the HTML data
 *
 * @param language
 * @returns {{format: ((function(*): (*|undefined))|*)}}
 */
export const createNumberFormatter = (language) => {
    const locale = getLocale(language);

    const formatter = new Intl.NumberFormat(locale, {
        maximumFractionDigits: 20
    });

    return {
        format: (number) => {
            try {
                return formatter.format(number);
            } catch (error) {
                logger.error(`Error formatting number '${number}' for locale '${locale}', using local translation: `, error);
                return convertNumberToDevanagari(number.toString()); // Manual conversion
            }
        }
    };
};

/**
 * Date formatter for the HTML data
 *
 * @param language
 * @returns {{format: ((function(*): (*|undefined))|*)}}
 */
export const createDateFormatter = (language) => {
    const locale = getLocale(language);

    const formatter = new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
    });

    return {
        format: (dateString) => {
            try {
                const date = new Date(dateString);
                if (isNaN(date.getTime())) {
                    return dateString;
                }
                return formatter.format(date);
            } catch (error) {
                logger.error(`Error formatting date '${dateString}' for locale '${locale}': `, error);
                return dateString;
            }
        }
    };
};


/**
 * Currency values formatter for the HTML data
 *
 * @param locale
 * @returns {{format: ((function(*): (*|string|undefined))|*)}}
 */
const createCurrencyFormatter = (locale) => {
    const numberFormatter = createNumberFormatter(locale);

    return {
        format: (value) => {
            try {
                const match = value.match(/^([^\d\s]+)\s*(\d+(\.\d{2})?)$/);
                if (!match) return value;

                const [, symbol, amount] = match;
                const number = parseFloat(amount);
                return `${symbol}${numberFormatter.format(number)}`;
            } catch (error) {
                logger.error(`Error formatting currency '${value}': `, error);
                return convertNumberToDevanagari(value); // Manual conversion
            }
        }
    };
};

/**
 * Just for Strings, which are not taken up and converted by any of the other translators
 *
 * @param locale
 * @returns {{translate: ((function(*): (*|string|undefined))|*)}}
 */
const createStringTranslator = (locale) => {
    const numberFormatter = createNumberFormatter(locale);
    const dateFormatter = createDateFormatter(locale);
    const currencyFormatter = createCurrencyFormatter(locale);

    const patterns = {
        date: /^\d{4}-\d{2}-\d{2}$/,
        currency: /^[^\d\s]+\s*\d+(\.\d{2})?$/,
        number: /\d+/
    };

    return {
        translate: (value) => {
            try {
                // Skip translation for email addresses
                if (value.includes('@')) return value;

                // Handle dates
                if (patterns.date.test(value)) {
                    return dateFormatter.format(value);
                }

                // Handle currency values
                if (patterns.currency.test(value)) {
                    return currencyFormatter.format(value);
                }

                // Handle plain numbers within text
                if (patterns.number.test(value)) {
                    return value.replace(/\d+/g, match => {
                        const formatted = numberFormatter.format(parseInt(match, 10));
                        return formatted.padStart(match.length, '0');
                    });
                }

                const parts = value.split(/([A-Za-z]+[/-]?)/); // Split by identifiers

                // If no number pattern is found, process parts and join them
                const translatedParts = parts.map(part => {
                    const numMatch = part.match(/^\d+$/);
                    if (numMatch) {
                        const formatted = numberFormatter.format(Number(numMatch[ 0 ])); //Format as number
                        return formatted.padStart(numMatch[ 0 ].length, '0');
                    }
                    return part;
                });
                return translatedParts.join('');

            } catch (error) {
                logger.error(`Error translating string '${value}': `, error);
                return value;
            }
        }
    };
};

/**
 * Main conversion and translation function which controls and sends data across for the locale
 *
 * @param locale
 * @returns {{translate: ((function(*): Promise<*|Awaited<unknown>[]|{}|undefined>)|*)}}
 */
const createDataTranslator = (locale) => {
    const numberFormatter = createNumberFormatter(locale);
    const stringTranslator = createStringTranslator(locale);

    const translateValue = async (value) => {
        try {
            if (typeof value === 'string') {
                return stringTranslator.translate(value);
            }

            if (typeof value === 'number') {
                return numberFormatter.format(value);
            }

            if (Array.isArray(value)) {
                return Promise.all(value.map(item => translateValue(item)));
            }

            if (value && typeof value === 'object') {
                const translatedObj = {};
                for (const key in value) {
                    if (value.hasOwnProperty(key)) {
                        // Skip translation for specific fields
                        if (key === 'strings' || key === 'email' || key === 'status') {
                            translatedObj[ key ] = value[ key ];
                        } else {
                            translatedObj[ key ] = await translateValue(value[ key ]);
                        }
                    }
                }
                return translatedObj;
            }

            return value;
        } catch (error) {
            logger.error(`Error in translateValue using '${locale}': `, error);
            return value;
        }
    };

    return {
        translate: async (data) => {
            try {
                return await translateValue(data);
            } catch (error) {
                logger.error(`Error in translateData using '${locale}': `, error);
                return data;
            }
        }
    };
};

/**
 * Function to translate the data when the structure and data is not known beforehand
 *
 * @param data
 * @param targetLanguage
 * @returns {Promise<Awaited<unknown>[]|{}|*|string>}
 */
export async function translateData(data, targetLanguage) {
    const locale = getLocale(targetLanguage);

    const translator = createDataTranslator(locale);
    return translator.translate(data);
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
    const templateKeys = extractKeysFromTemplate(__dirname + '/p.html');

    for (const key of templateKeys) {
        try {
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

module.exports = {renderTemplate};