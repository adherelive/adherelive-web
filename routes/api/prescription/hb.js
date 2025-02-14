/**
 * README:
 *
 * Structure:
 * The template uses {{strings.xxx}} for all static text, making it easy to switch languages
 * Dynamic data uses simple {{variable}} syntax for single values
 * {{#each}} blocks for arrays and nested data
 * Maintained semantic HTML structure with proper sections
 *
 *
 * Key features of this approach:
 * Language Switching:
 * All static text is referenced through strings object
 * Change language by switching the strings property in the data object
 * Can load language files dynamically from JSON
 *
 * Dynamic Data:
 * Supports single values ({{userData.name}})
 * Arrays with {{#each}} loops
 * Nested data structures (products with variants)
 * Table generation from arrays
 *
 * Flexibility:
 * Easy to add new sections
 * Can handle different data types
 * Maintains clean separation between structure and content
 *
 */
import { createLogger } from "../../../libs/logger";
import fs from "fs";
import mongoose from "mongoose";

const Handlebars = require('handlebars');
const rateLimit = require('express-rate-limit');
const {Translate} = require('@google-cloud/translate').v2;

// MongoDB Schema for translations
const TranslationSchema = new mongoose.Schema({
    key: {type: String, required: true},
    sourceLanguage: {type: String, required: true},
    targetLanguage: {type: String, required: true},
    sourceText: {type: String, required: true},
    translatedText: {type: String, required: true},
    context: {type: String, default: 'static'}, // 'static' or 'dynamic'
    lastUsed: {type: Date, default: Date.now},
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now}
});

// Create a compound index for efficient lookups
TranslationSchema.index({
    key: 1,
    sourceLanguage: 1,
    targetLanguage: 1
}, {unique: true});

const Translation = mongoose.model('Translation', TranslationSchema);

// Translation service setup
const translate = new Translate({
    projectId: process.config.google_keys.GOOGLE_CLOUD_PROJECT_ID,
    keyFilename: process.config.google_keys.GOOGLE_APPLICATION_CREDENTIALS,
});

const logger = createLogger("ENHANCED TRANSLATION API");

// Read and compile template
const template = fs.readFileSync(__dirname + '/p.html', 'utf-8');
const compiledTemplate = Handlebars.compile(template);

// Cache for translations to reduce API calls
const translationCache = new Map();

export const localeMap = {
    'hi': 'hi-IN',   // Hindi (India)
    'es': 'es-ES',   // Spanish (Spain)
    'ja': 'ja-JP',   // Japanese
    'zh': 'zh-CN',   // Chinese (Simplified)
    'ar': 'ar-SA',   // Arabic (Saudi Arabia)
    // Add more mappings as needed
};

// Language strings (can be loaded from JSON files)
const languages = require('../../../other/test.json');

// As the browsers and Google Translate does not do this
const devanagariDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];

/**
 * For getting and converting the target language to a locale
 *
 * @param language
 * @returns {*}
 */
const getLocale = (language) => {
    try {
        // If a full locale is provided (e.g., 'hi-IN'), return it as is
        if (language.includes('-')) {
            return language;
        }

        // If only language code is provided, get the mapped locale
        return localeMap[ language ] || language;
    } catch (error) {
        logger.error(`Error getting locale for language ${language}:`, error);
        return language;
    }
};

// New function to detect language
async function detectLanguage(text) {
    try {
        const [detection] = await translate.detect(text);
        return detection.language;
    } catch (error) {
        logger.error('Language detection failed:', error);
        return null;
    }
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

// Function to check and retrieve translation from MongoDB
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
        logger.error('Error retrieving translation from MongoDB:', error);
        return null;
    }
}

// Enhanced translation function with language detection
async function translateWithDetection(text, targetLanguage) {
    try {
        // Detect the language of the input text
        const detectedLanguage = await detectLanguage(text);

        // If we couldn't detect the language, assume it's English
        const sourceLanguage = detectedLanguage || 'en';

        // If text is already in target language, return as is
        if (sourceLanguage === targetLanguage) {
            return {
                sourceLanguage,
                sourceText: text,
                translatedText: text
            };
        }

        // Translate the text
        const [translation] = await translate.translate(text, {
            from: sourceLanguage,
            to: targetLanguage
        });

        return {
            sourceLanguage,
            sourceText: text,
            translatedText: translation
        };
    } catch (error) {
        logger.error('Translation with detection failed:', error);
        return {
            sourceLanguage: 'en',
            sourceText: text,
            translatedText: text
        };
    }
}


// Function to store translation in MongoDB
async function storeTranslation(key, sourceLanguage, targetLanguage, sourceText, translatedText, context = 'static') {
    try {
        // Ensure we're not storing identical source and translated text when languages differ
        if (sourceLanguage !== targetLanguage && sourceText === translatedText) {
            logger.warn(`Attempted to store identical source and translated text for different languages: ${sourceLanguage} -> ${targetLanguage}`);
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
        logger.error('Error storing translation in MongoDB:', error);
    }
}

// Enhanced function to handle both static and dynamic translations
async function translateContent(content, sourceLanguage, targetLanguage) {
    try {
        // Skip translation if content is empty or target language is English
        if (!content || targetLanguage === 'en') {
            return content;
        }

        // Generate cache key
        const cacheKey = `${content}_${targetLanguage}`;

        // Check cache first
        if (translationCache.has(cacheKey)) {
            return translationCache.get(cacheKey);
        }

        // Handle different content types
        const translatedContent = await handleContentTranslation(content, targetLanguage);

        // Cache the result
        translationCache.set(cacheKey, translatedContent);

        return translatedContent;
    } catch (error) {
        logger.error(`Translation failed for content: ${content}`, error);
        return content; // Fallback to original content
    }
}

async function handleContentTranslation(content, targetLanguage) {
    // Handle different types of content
    if (typeof content === 'number') {
        return content; // Numbers don't need translation
    }

    if (typeof content === 'string') {
        // Skip translation for special cases
        if (shouldSkipTranslation(content)) {
            return content;
        }

        try {
            const [translation] = await translate.translate(content, targetLanguage);
            return translation;
        } catch (error) {
            logger.error(`Failed to translate string: ${content}`, error);
            return content;
        }
    }

    if (Array.isArray(content)) {
        return Promise.all(content.map(item => handleContentTranslation(item, targetLanguage)));
    }

    if (content && typeof content === 'object') {
        const translatedObj = {};
        for (const [key, value] of Object.entries(content)) {
            translatedObj[ key ] = await handleContentTranslation(value, targetLanguage);
        }
        return translatedObj;
    }

    return content;
}

// Helper function to handle dynamic content translation with MongoDB
async function translateDynamicContent(content, targetLanguage) {
    if (typeof content === 'string') {
        try {
            // Generate a unique key for dynamic content
            const contentKey = `dynamic_${Buffer.from(content).toString('base64')}`;

            // Check MongoDB first
            const storedTranslation = await Translation.findOne({
                key: contentKey,
                targetLanguage
            });

            if (storedTranslation) {
                return storedTranslation.translatedText;
            }

            // If not found, detect language and translate
            const {sourceLanguage, sourceText, translatedText} =
                await translateWithDetection(content, targetLanguage);

            // Store the translation
            await storeTranslation(
                contentKey,
                sourceLanguage,
                targetLanguage,
                sourceText,
                translatedText,
                'dynamic'
            );

            return translatedText;
        } catch (error) {
            logger.error('Dynamic translation failed:', error);
            return content;
        }
    }

    // Handle arrays and objects recursively
    if (Array.isArray(content)) {
        return Promise.all(content.map(item =>
            translateDynamicContent(item, targetLanguage)
        ));
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

function shouldSkipTranslation(content) {
    // Skip translation for these cases
    return (
        !content || // Empty content
        content.includes('@') || // Email addresses
        /^[0-9]+$/.test(content) || // Pure numbers
        /^(https?:\/\/)/.test(content) || // URLs
        /{{\s*[\w.]+\s*}}/.test(content) // Handlebars expressions
    );
}


// Utility function to clean up old translations
export async function cleanupOldTranslations(daysOld = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    try {
        const result = await Translation.deleteMany({
            lastUsed: {$lt: cutoffDate}
        });
        logger.info(`Cleaned up ${result.deletedCount} old translations`);
    } catch (error) {
        logger.error('Error cleaning up old translations:', error);
    }
}

// Translation Validations
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
                logger.error(`Error formatting number ${number} for locale ${locale}, using local translation:`, error);
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
                logger.error(`Error formatting date ${dateString} for locale ${locale}:`, error);
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
                logger.error(`Error formatting currency ${value}:`, error);
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
                logger.error(`Error translating string ${value}:`, error);
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
            logger.error('Error in translateValue:', error);
            return value;
        }
    };

    return {
        translate: async (data) => {
            try {
                return await translateValue(data);
            } catch (error) {
                logger.error('Error in translateData:', error);
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
    logger.debug(`Translating data using locale: ${locale}`);

    const translator = createDataTranslator(locale);
    return translator.translate(data);
}

/**
 * Function to get the translations from local ot the translation API
 *
 * @param sourceLanguage
 * @param targetLanguage
 * @param strings
 * @returns {Promise<{}>}
 */
async function getTranslations(sourceLanguage, targetLanguage, strings) {
    // Create a complete strings object with fallback to translation API
    const translatedStrings = {};

    // Get all string keys from HTML template
    const templateKeys = extractKeysFromTemplate(__dirname + '/p.html');

    for (const key of templateKeys) {
        try {
            // Check if translation exists in JSON file
            if (strings[ targetLanguage ]?.[ key ]) {
                translatedStrings[ key ] = strings[ targetLanguage ][ key ];
                continue;
            }

            // Check if translation exists in MongoDB
            const storedTranslation = await getStoredTranslation(key, sourceLanguage, targetLanguage);
            if (storedTranslation) {
                translatedStrings[ key ] = storedTranslation;
                continue;
            }

            // If not found, get source text and translate
            const sourceText = strings[ sourceLanguage ]?.[ key ] || key;


            // Translate with language detection
            const {
                sourceLanguage: detectedSource,
                translatedText
            } = await translateWithDetection(sourceText, targetLanguage);

            const [translation] = await translate.translate(sourceText, targetLanguage);

            // TODO: Translate missing content, already being done with the above, so this is not required
            // const translatedContent = await translateContent(sourceText, sourceLanguage, targetLanguage);
            // translatedStrings[key] = translatedContent;

            // Store new translation in MongoDB
            await storeTranslation(
                key,
                detectedSource,
                targetLanguage,
                sourceText,
                translatedText
            );

            translatedStrings[ key ] = translatedText;

            // Update in-memory strings object
            if (!strings[ targetLanguage ]) {
                strings[ targetLanguage ] = {};
            }
            strings[ targetLanguage ][ key ] = translation;
            // strings[targetLanguage][key] = translatedContent;

            // Save to database for future reference
            // await saveTranslation(key, targetLanguage, translatedContent);

        } catch (error) {
            logger.error(`Failed to translate ${key}: `, error);
            // Fallback to source language
            translatedStrings[ key ] = strings[ sourceLanguage ]?.[ key ] || key;
        }
    }

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
 * Function to replace all values in the dynamic data and HTML fields using handlebars
 *
 * @param targetLanguage
 * @returns {Promise<string>}
 */
export async function renderTemplate(targetLanguage) {
    try {
        // Get translations for static content
        const strings = await getTranslations('en', targetLanguage, languages);

        // Update data object with translations
        // Prepare dynamic data
        const dynamicData = {
            strings, // Switch language here
            title: "User Dashboard",
            userData: {
                name: "John Doe",
                email: "john@example.com"
            },
            orders: [
                {id: "ORD-001", date: "2024-02-14", amount: "$100", status: "Completed"},
                {id: "ORD-002", date: "2024-02-02", amount: "$75.00", status: "Processing"},
                {id: "ORD-300", date: "15/02/2024", amount: "$0.05", status: "Pending"},
                {id: "ORD-042", date: "14-02-2024", amount: "$01.25", status: "Processing"}
            ],
            products: [
                {
                    name: "Product A",
                    variants: [
                        {name: "Small", price: "$10.98", stock: 5},
                        {name: "Large", price: "$15.91", stock: 3}
                    ]
                },
                {
                    name: "Product B",
                    variants: [
                        {name: "Small", price: "102.95", stock: 5.5},
                        {name: "Large", price: "$0.02", stock: 0.034}
                    ]
                },
                {
                    name: "Product C",
                    variants: [
                        {name: "Small", price: "$1000", stock: 5},
                        {name: "Large", price: "$150", stock: 3}
                    ]
                }
            ]
        };

        // Translate dynamic content
        // const translatedDynamicData = await handleContentTranslation(dynamicData, targetLanguage);

        // Translate dynamic content recursively
        const translatedDynamicData = await translateDynamicContent(
            dynamicData,
            'en',
            targetLanguage
        );

        // Merge strings and translated data
        const data = {
            strings,
            ...translatedDynamicData // Spread the translated data into the main data object
        };

        // Render template
        return compiledTemplate(data);
    } catch (error) {
        logger.error('Template rendering failed:', error);
        // Fallback to English
        return compiledTemplate({...data, strings: languages.en});
    }
}

// Adding a DB to store the translations from Google
async function saveTranslation(key, language, text) {
    await db.translations.upsert({
        key,
        language,
        text,
        source: 'google-translate',
        timestamp: new Date()
    });
}

// API calls rate limiter, Set up rate limiter
export const translationLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many translation requests, please try again later'
});

module.exports = {renderTemplate};