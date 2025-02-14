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
import express from "express";
import Authenticated from "../middleware/auth";
import { createLogger } from "../../../libs/logger";
import fs from "fs";

const Handlebars = require('handlebars');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const {Translate} = require('@google-cloud/translate').v2;

const translate = new Translate({
    projectId: process.config.google_keys.GOOGLE_CLOUD_PROJECT_ID,
    keyFilename: process.config.google_keys.GOOGLE_APPLICATION_CREDENTIALS,
});

const logger = createLogger("NEW TEST PRESCRIPTION API");

// Read and compile template
const template = fs.readFileSync(__dirname + '/p.html', 'utf-8');
const compiledTemplate = Handlebars.compile(template);

// Language strings (can be loaded from JSON files)
const languages = {
    en: {
        welcome: "Welcome to Our Platform",
        description: "View your account information below",
        userInfo: "User Information",
        name: "Name",
        email: "Email",
        orderHistory: "Order History",
        orderId: "Order ID",
        date: "Date",
        amount: "Amount",
        status: "Status",
        productDetails: "Product Details",
        variant: "Variant",
        price: "Price",
        stock: "Stock"
    },
    hi: {
        welcome: "हमारे मंच में आपका स्वागत है",
        description: "नीचे अपनी खाता जानकारी देखें",
        userInfo: "उपयोगकर्ता जानकारी",
        name: "नाम",
        email: "ईमेल",
        orderHistory: "ऑर्डर इतिहास",
        orderId: "ऑर्डर आईडी",
        date: "तारीख",
        amount: "राशि",
        status: "स्थिति",
        productDetails: "उत्पाद विवरण",
        variant: "संस्करण",
        price: "मूल्य",
        stock: "स्टॉक"
    }
};

/**
 * Function for translating individual data values which are known
 * E.g.: await translateDataValue("User Dashboard", targetLanguage),
 *
 * @param value
 * @param targetLanguage
 * @returns {Promise<*|string>}
 */
async function translateDataValue(value, targetLanguage) {
    try {
        const [translation] = await translate.translate(value, targetLanguage);
        return translation;
    } catch (error) {
        logger.error(`Failed to translate data value "${value}":`, error);
        return value; // Fallback to original value
    }
}

/**
 * Function to translate numerical values of an International language
 * We are using JavaScript for this, as Google and Local translations do not do number translations
 *
 * @param number
 * @param targetLanguage
 * @returns {string}
 */
function formatNumber(number, targetLanguage) {
    const options = {
        style: 'decimal', // Or 'decimal' if you don't need currency formatting
        currency: 'USD' // Set the appropriate currency if needed, can be dynamic
    };

    let localTargetLang = null;

    if(targetLanguage === 'hi') {
        localTargetLang = targetLanguage + '-IN';
    }

    try {
        const formatter = new Intl.NumberFormat(localTargetLang, options);
        logger.debug('Formatted Number: ', formatter.format(number));
        return formatter.format(number);
    } catch (error) {
        console.error(`Error formatting number ${number}: `, error);
        return number.toString(); // Fallback to string conversion
    }
}

/**
 * Function to translate date values of an International language
 * We are using JavaScript for this, as Google and Local translations do not do date values translations
 *
 * @param dateString
 * @param targetLanguage
 * @returns {string}
 */
function formatDate(dateString, targetLanguage) {
    const date = new Date(dateString); // Parse the date string

    const options = {
        year: 'numeric',
        month: 'numeric', // Or 'short', 'numeric', etc.
        day: 'numeric'
    };

    try {
        const formatter = new Intl.DateTimeFormat(targetLanguage, options);
        logger.debug('Formatted Date: ', formatter.format(data));
        return formatter.format(date);
    } catch (error) {
        console.error(`Error formatting date ${dateString}:`, error);
        return dateString; // Fallback to original date string
    }
}

/**
 * Function to extract and translate the individual numbers in any string
 *
 * @param inputString
 * @param targetLanguage
 * @returns {*}
 */
function updateStringWithNumbers(inputString, targetLanguage) {
    // Regex to match strings that contain numbers but not dates
    const numberRegex = /[^\d]*\d+(\.\d+)?[^\d]*/;
    const dateRegex = /\b(\d{4}-\d{2}-\d{2})|(\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4})\b/;

    if (dateRegex.test(inputString)) {
        console.error("Input string contains a date.");
        return inputString; // Return the original string if a date is found
    }

    // Replace the number in the string with the updated number
    const updatedString = inputString.replace(numberRegex, (match, number) => {
        const numericValue = parseFloat(number); // Extract the numeric part and convert to a number
        const updatedNumber = numericValue + 1; // Increment the number by 1 (or any other calculation)
        return match.replace(number, formatNumber(updatedNumber, targetLanguage)); // Replace the number in the match with the updated number
    });

    logger.debug('String which has been updated with the latest numbers: ', updatedString);
    return updatedString;
}

/**
 * Function to translate the data when the structure and data is not known beforehand
 *
 * @param data
 * @param targetLanguage
 * @returns {Promise<Awaited<unknown>[]|{}|*|string>}
 */
async function translateData(data, targetLanguage) {
    // Improved regex for strings that contain numbers or numbers with decimals, not base character strings
    const numberRegex = /[^\d]*\d+(\.\d+)?[^\d]*/;
    // Check for valid dates ONLY if the string does NOT contain other characters
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/; // ISO 8601 date format

    logger.debug('Raw data received: ', data);
    if (typeof data === 'number') {
        return formatNumber(data, targetLanguage);
    } else if (data instanceof Date) {
        return formatDate(data, targetLanguage);
    } else if (typeof data === 'string') {
        if (numberRegex.test(data)) {
            logger.debug('Does it come here for strings with a $?');
            return updateStringWithNumbers(data, targetLanguage);
        } else {
            if (dateRegex.test(data)) {
                return formatDate(data, targetLanguage);
            } else {
                return translateDataValue(data, targetLanguage);
            }
        }
    } else if (Array.isArray(data)) {
        return Promise.all(
            data.map(async (item) => await translateData(item, targetLanguage))
        );
    } else if (typeof data === 'object' && data !== null) {
        const translatedObject = {};
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                translatedObject[ key ] = await translateData(data[ key ], targetLanguage);
            }
        }
        return translatedObject;
    } else {
        return data;
    }
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
        if (strings[ targetLanguage ]?.[ key ]) {
            // Use existing translation if available
            translatedStrings[ key ] = strings[ targetLanguage ][ key ];
        } else {
            try {
                // Get source text
                const sourceText = strings[ sourceLanguage ][ key ] || key;

                // Translate using Google API
                const [translation] = await translate.translate(sourceText, targetLanguage);

                // Validate translation
                try {
                    validateTranslation(sourceText, translation, targetLanguage);
                } catch (validationError) {
                    logger.warn(`Validation failed for ${key}:`, validationError);
                    // Fall back to source text if validation fails
                    translatedStrings[ key ] = sourceText;
                    continue;
                }

                // Store translation
                translatedStrings[ key ] = translation;

                // Optionally, save to your translation files for future use
                if (!strings[ targetLanguage ]) strings[ targetLanguage ] = {};
                strings[ targetLanguage ][ key ] = translation;
            } catch (error) {
                logger.error(`Failed to translate ${key}:`, error);
                // Fallback to source language
                translatedStrings[ key ] = strings[ sourceLanguage ][ key ] || key;
            }
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
 *
 * @param targetLanguage
 * @returns {Promise<string>}
 */
async function renderTemplate(targetLanguage) {
    try {
        // Get translations, falling back to Google Translate if needed
        const strings = await getTranslations('en', targetLanguage, languages);

        // Update data object with translations
        // Sample dynamic data
        const dynamicData = {
            strings, // Switch language here
            title: "User Dashboard",
            userData: {
                name: "John Doe",
                email: "john@example.com"
            },
            orders: [
                {id: "ORD-001", date: "2024-02-14", amount: "$100", status: "Completed"},
                {id: "ORD-002", date: "2024-02-13", amount: "$75", status: "Processing"}
            ],
            products: [
                {
                    name: "Product A",
                    variants: [
                        {name: "Small", price: "$10", stock: 5},
                        {name: "Large", price: "$15", stock: 3}
                    ]
                }
            ]
        };

        // Translate data recursively
        const translatedDynamicData = await translateData(dynamicData, targetLanguage);

        // Merge strings and translated data
        const data = {
            strings,
            ...translatedDynamicData // Spread the translated data into the main data object
        };

        // Render template
        return compiledTemplate(data);
    } catch (error) {
        logger.error('Translation error:', error);
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

// API calls rate limiter, Set up rate limiter
const translationLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many translation requests, please try again later'
});

/**
 * This is the API call in the node.js call to test if the HTML conversion works as expected
 * Can add details of what all needs to be done in the p.html for further experiments
 *
 * @returns HTML data
 */
router.get('/test/:language', Authenticated, async (req, res) => {
    try {
        const html = await renderTemplate(req.params.language);
        return res.send(html);
    } catch (error) {
        logger.error('Error rendering template:', error);
        return res.status(500).send('Error generating page');
    }
});

module.exports = router;