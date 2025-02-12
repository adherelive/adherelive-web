import express from "express";
import Authenticated from "../middleware/auth";
import multer from "multer";
import { createLogger } from "../../../libs/logger";
import fs from "fs";
import path from "path";
import moment from "moment";

// Services
import userService from "../../../app/services/user/user.service";
import patientService from "../../../app/services/patients/patients.service";
import carePlanService from "../../../app/services/carePlan/carePlan.service";
import medicineService from "../../../app/services/medicine/medicine.service";
import appointmentService from "../../../app/services/appointment/appointment.service";
import medicationReminderService from "../../../app/services/medicationReminder/mReminder.service";
import conditionService from "../../../app/services/condition/condition.service";
import qualificationService from "../../../app/services/doctorQualifications/doctorQualification.service";
import doctorRegistrationService from "../../../app/services/doctorRegistration/doctorRegistration.service";
import userRolesService from "../../../app/services/userRoles/userRoles.service";
import DietService from "../../../app/services/diet/diet.service";
import PortionServiceService from "../../../app/services/portions/portions.service";
import RepetitionService from "../../../app/services/exerciseRepetitions/repetition.service";
import WorkoutService from "../../../app/services/workouts/workout.service";
import userPreferenceService from "../../../app/services/userPreferences/userPreference.service";

// API Wrappers
import UserRolesWrapper from "../../../app/apiWrapper/web/userRoles";
import UserWrapper from "../../../app/apiWrapper/web/user";
import CarePlanWrapper from "../../../app/apiWrapper/web/carePlan";
import AppointmentWrapper from "../../../app/apiWrapper/web/appointments";
import MReminderWrapper from "../../../app/apiWrapper/web/medicationReminder";
import MedicineApiWrapper from "../../../app/apiWrapper/mobile/medicine";
import PatientWrapper from "../../../app/apiWrapper/web/patient";
import ConditionWrapper from "../../../app/apiWrapper/web/conditions";
import QualificationWrapper from "../../../app/apiWrapper/web/doctorQualification";
import RegistrationWrapper from "../../../app/apiWrapper/web/doctorRegistration";
import DegreeWrapper from "../../../app/apiWrapper/web/degree";
import CouncilWrapper from "../../../app/apiWrapper/web/council";
import DietWrapper from "../../../app/apiWrapper/web/diet";
import ProviderWrapper from "../../../app/apiWrapper/web/provider";
import PortionWrapper from "../../../app/apiWrapper/web/portions";
import WorkoutWrapper from "../../../app/apiWrapper/web/workouts";
import UserPreferenceWrapper from "../../../app/apiWrapper/web/userPreference";

import * as DietHelper from "../../../app/controllers/diet/diet.helper";
import { downloadFileFromS3 } from "../../../app/controllers/user/user.helper";

import {
    APPOINTMENT_TYPE,
    categories,
    DOSE_UNIT,
    MEDICATION_TIMING,
    S3_DOWNLOAD_FOLDER,
    S3_DOWNLOAD_FOLDER_PROVIDER,
    USER_CATEGORY,
    WHEN_TO_TAKE_ABBREVATIONS,
} from "../../../constant";

import { getFilePath } from "../../../app/helper/s3FilePath";
import { checkAndCreateDirectory } from "../../../app/helper/common";
import { getDoctorCurrentTime } from "../../../app/helper/getUserTime";
import { raiseClientError, raiseServerError } from "../helper";


// Fetch the Google Translation API and 'puppeteer' along with 'handlebars' for the HTML to PDF conversion
const {TranslationServiceClient} = require('@google-cloud/translate').v3beta1;
const puppeteer = require("puppeteer");
const handlebars = require("handlebars");

const logger = createLogger("PRESCRIPTION API");
const generationTimestamp = moment().format('MMMM Do YYYY, h:mm:ss A'); // Format with Moment.js
// Created the router object using express.Router()
const router = express.Router();

// Initialize the translation client
// Make sure you have set up Google Cloud credentials properly
const translationClient = new TranslationServiceClient();
const PROJECT_ID = process.config.google_keys.GOOGLE_CLOUD_PROJECT_ID;

// Cache configuration
const CACHE_TTL = 3600000; // 1 hour in milliseconds
const MAX_TRANSLATION_LENGTH = 5000; // Replace with the actual API limit
const translationCache = new Map(); // In-memory cache

// Register Handlebars helpers
handlebars.registerHelper("print", function (value) {
    return ++value;
});

// For the Diet/Workout data display, should only be shown if either exists
handlebars.registerHelper('or', function () {
    return Array.prototype.slice.call(arguments, 0, -1).some(Boolean);
});

// Updated the {{translate}} helper to validate the input before calling translateText
handlebars.registerHelper('translate', async function (text, targetLang = 'hi') {
    if (!text || typeof text !== 'string' || text.trim() === '') {
        return ''; // Return an empty string for invalid inputs
    }
    return await translateText(text, targetLang);
});

// Register Handlebars helper:
handlebars.registerHelper('safe', function (content) {
    return new handlebars.SafeString(content);
});


/**
 * TODO: Will implement these aspects later
 // Monitor translation coverage
 const missingTranslations = {};

 // Periodically analyze your logs to identify commonly translated strings
 const analyzeLogs = async () => {
 };

 // Script to update your local JSON
 const updateLocalJSON = async () => {
     const currentJSON = require('../../../other/web-hi.json');
     const newTranslations = await getFrequentTranslations();
     const updatedJSON = {
         ...currentJSON,
         ...newTranslations
    };
    await fsp.writeFile(__dirname + '../../../other/web-hi.json', JSON.stringify(updatedJSON, null, 2));
 };
 */

/**
 * This function will normalize the key by removing special characters and replacing spaces with underscores
 * Utility function for consistent key handling
 *
 * @param key
 * @returns {*}
 */
function normalizeKey(key) {
    return key
        .trim()
        .replace(/\s*\/\s*/g, '/') // Handle "Age / Gender" → "Age/Gender"
        .replace(/[^a-zA-Z0-9\u0900-\u097F/]/g, '_') // Preserve Devanagari chars
        .replace(/[_\s]+/g, '_'); // Replace spaces with underscores
}

let missingTranslations = [];

/**
 * Function to translate each of the labels, before they are sent to the HandleBars
 *
 * @param labels
 * @param targetLang
 * @returns {Promise<{}>}
 */
async function translateStaticLabels(labels, targetLang = 'hi') {
    const local = getLocalTranslations();
    const translations = {};

    for (const label of labels) {
        const normalized = normalizeKey(label);

        // Check & try exact match first
        if (local[ normalized ]) {
            translations[ normalized ] = local[ normalized ];
            continue;
        }

        if (!local[ normalized ]) {
            missingTranslations.push(label);
            logger.warn(`Missing translation for: ${label}`);
        }

        // Check and try original (normalized) key match next
        if (local[ label ]) {
            translations[ normalized ] = local[ label ];
            continue;
        }

        // Use Google Cloud Translation API as fallback
        translations[ normalized ] = await translateText(label, targetLang);
        logger.debug(`Original Label: ${label}, Translation: ${translations[ label ]}`);
    }

    return translations;
}

// Helper function to optimize local translations loading
let localTranslationsCache = null;

function getLocalTranslations() {
    if (!localTranslationsCache) {
        localTranslationsCache = require('../../../other/web-hi.json');
    }
    return localTranslationsCache;
}

// Batch translation helper
const translationQueue = new Map();
const BATCH_TIMEOUT = 100; // ms
const MAX_BATCH_SIZE = 128; // characters

/**
 * This is the function which will not do the batch translations for Google Cloud API
 *
 * @param text
 * @param targetLang
 * @returns {Promise<unknown>}
 */
async function getGoogleTranslation(text, targetLang) {
    const queueKey = targetLang;

    if (!translationQueue.has(queueKey)) {
        translationQueue.set(queueKey, {
            texts: [],
            resolvers: [], // Array to store resolve/reject pairs
            timer: null
        });

        // Set up batch processing
        const batch = translationQueue.get(queueKey);
        batch.timer = setTimeout(async () => {
            // Get the current batch and clear it from the queue
            const currentBatch = translationQueue.get(queueKey);
            translationQueue.delete(queueKey);

            if (currentBatch.texts.length > 0) {
                try {
                    const [response] = await translationClient.translateText({
                        parent: `projects/${PROJECT_ID}/locations/global`,
                        contents: currentBatch.texts,
                        mimeType: 'text/plain',
                        targetLanguageCode: targetLang,
                    });

                    // Resolve all promises with their respective translations
                    const translations = response.translations.map(t => t.translatedText);
                    currentBatch.resolvers.forEach((resolver, index) => {
                        resolver.resolve(translations[ index ]);
                    });
                } catch (error) {
                    // Reject all promises if there's an error
                    currentBatch.resolvers.forEach(resolver => {
                        resolver.reject(error);
                    });
                }
            }
        }, BATCH_TIMEOUT);
    }

    const batch = translationQueue.get(queueKey);
    const index = batch.texts.length;
    batch.texts.push(text);

    // Create a new promise for this translation
    return new Promise((resolve, reject) => {
        batch.resolvers.push({resolve, reject});
    });
}

/**
 * A translation function that first checks the local JSON and then falls back to the cloud APIs.
 * This function should handle both single words and longer strings.
 *
 * @param text
 * @param targetLang
 * @returns {Promise<*|string>}
 */
async function translateText(text, targetLang = 'hi') {
    try {
        // const localTranslations = require('../../../other/web-hi.json'); // Load your JSON file

        // Check if the input text is valid
        if (!text || typeof text !== 'string' || text.trim() === '') {
            return ''; // Return empty string for invalid input
        }

        // Generate cache key
        const cacheKey = `${text}_${targetLang}`;

        // Check cache first
        const cachedResult = translationCache.get(cacheKey);
        if (cachedResult && ( Date.now() - cachedResult.timestamp < CACHE_TTL )) {
            return cachedResult.translation;
        }

        // Load local translations (do this once and cache it)
        const localTranslations = getLocalTranslations();

        // Check local JSON first
        if (targetLang === 'hi' && localTranslations[ text ]) {
            const translation = localTranslations[ text ];
            translationCache.set(cacheKey, {
                translation,
                timestamp: Date.now()
            });
            return translation;
        }

        // Use batch translation for Google Cloud API
        const translation = await getGoogleTranslation(text, targetLang);

        // Cache the result
        translationCache.set(cacheKey, {
            translation,
            timestamp: Date.now()
        });

        return translation;
    } catch (error) {
        logger.error("Translation error: ", error);
        return text; // Fallback to original text if JSON loading fails
    }
}

/**
 * Before passing the dataBinding object to the Handlebars template, recursively translate all its string values.
 *
 * @param obj
 * @param targetLang
 * @returns {Promise<*>}
 */
async function translateObjectToHindi(obj, targetLang = 'hi') {
    for (let key in obj) {
        if (typeof obj[ key ] === 'string') {
            // Translate only non-empty strings
            obj[ key ] = obj[ key ].trim() !== '' ? await translateText(obj[ key ], targetLang) : '';
        } else if (typeof obj[ key ] === 'object' && obj[ key ] !== null) {
            // Recursively translate nested objects
            await translateObjectToHindi(obj[ key ], targetLang);
        }
    }
    return obj;
}

// Add date translation logic
// function localizeDates(dateString) {
//     // Convert "2023-08-20" to Hindi numerals
//     return convertToDevanagariNumerals(dateString);
// }

/**
 * This function is used to convert HTML to PDF in English
 *
 *
 * @param {String} templateHtml
 * @param {Object} dataBinding
 * @param {Object} options
 *
 * @returns {Promise<Buffer>}
 * @throws {Error}
 */
async function convertHTMLToPDFEn({templateHtml, dataBinding, options}) {

    try {
        const template = handlebars.compile(templateHtml);
        const finalHtml = encodeURIComponent(template(dataBinding));

        const browser = await puppeteer.launch({
            args: ["--no-sandbox"],
            headless: true,
        });
        const page = await browser.newPage();

        // Inject page numbers using evaluateHandle
        await page.evaluateHandle(() => {
            const style = document.createElement('style');
            style.textContent = `
        @page {
            size: A4; /* Ensure A4 size if not already set */
            margin: 10mm 5mm; /* Set your margins */
            @bottom-center { /* Footer content */
                content: "Page " counter(page) " of " counter(pages);
            }
        }
        .footer { /* Style your footer */
            width: 100%;
            text-align: center;
            padding-top: 10px;
            border-top: 1px solid black;
        }`;
            document.head.appendChild(style);

            // Get the current timestamp (you can format this server-side)
            const now = new Date();
            const timestamp = now.toLocaleString(); // Or any format you prefer

            // Add the timestamp to the footer
            const footer = document.querySelector('.footer');
            if (footer) {
                const timestampElement = document.createElement('p');
                timestampElement.textContent = `Generated via AdhereLive platform<br/>${timestamp}`;
                footer.appendChild(timestampElement);
            }
        });

        await page.setContent(finalHtml);

        // Set viewport to A4 size
        await page.setViewport({
            width: 794, // A4 width in pixels at 96 DPI
            height: 1123, // A4 height in pixels at 96 DPI
            deviceScaleFactor: 2, // Higher resolution
        });

        await page.goto(`data:text/html;charset=UTF-8,${finalHtml}`, {
            waitUntil: "networkidle0",
        });

        /**
         * based on = pdf(options?: PDFOptions): Promise<Buffer>;
         * from https://pptr.dev/api/puppeteer.page.pdf
         * pdfBuffer will store the PDF file Buffer content when "path is not provided"
         */
        let pdfBuffer = await page.pdf(options);
        logger.info('Prescription PDF file generated successfully!');


        await browser.close();
        return pdfBuffer; // Returning the value when page.pdf promise gets resolved
    } catch (error) {
        logger.error('Error in generating prescription PDF:', error);
        throw error;
    }
}

/**
 * This is the function which does the actual HTML to PDF conversion in Hindi
 *
 * @param templateHtml
 * @param dataBinding
 * @param options
 * @returns {Promise<Buffer<ArrayBufferLike>>}
 */
async function convertHTMLToPDFHi({templateHtml, dataBinding, options}) {
    try {
        const startTime = process.hrtime();

        // Call the 'translateStaticLabels' function with an array of all static labels in your HTML file
        // This allows to pre-translate static labels
        const staticLabels = [
            "Patient Name",
            "Registration",
            "date",
            "time",
            "Age",
            "Gender",
            "Doctor Name",
            "Patient",
            "Address",
            "Doctor Email",
            "Relevant History",
            "Allergies",
            "Comorbidities",
            "Diagnosis",
            "Symptoms",
            "General",
            "Systematic Examination",
            "Treatment And Follow-up Advice",
            "Height",
            "Weight",
            "Name of Medicine",
            "Dose",
            "Qty",
            "Medicine Schedule",
            "Morning",
            "Afternoon",
            "Night",
            "Start Date",
            "Duration",
            "Diet",
            "Workout",
            "Patient Mobile No.",
            "ID",
            "From",
            "Investigation",
            "Next Consultation",
            "Diet Name",
            "TimeDetails",
            "Repeat Days",
            "What Not to Do",
            "Total Calories",
            "Workout Name",
            "Time",
            "Details",
            "repetitions",
            "Page",
            "Generated via AdhereLive platform",
            "Signature",
            "Stamp",
            "Purpose",
            "Description",
            "Date",
            "Take whenever required",
            "Cal",
        ];
        // Add translated labels to dataBinding
        dataBinding.translatedLabels = await translateStaticLabels(staticLabels, options.translateTo);
        logger.debug('Translated Labels: ', dataBinding.translatedLabels);

        // Translate the data binding object
        const translatedDataBinding = await translateObjectToHindi(dataBinding, options.translateTo);
        logger.debug('Translated Data Binding: ', translatedDataBinding);

        // Compile template with translated data
        const template = handlebars.compile(templateHtml);
        let finalHtml = template(translatedDataBinding);

        // logger.debug('The Final HTML with translated labels', finalHtml);

        // Log the length of individual sections (if applicable)
        logger.debug("Length of HTML before translation: ", finalHtml.length); // Log the total length
        // logger.debug("Length of patient_data.name:", dataBinding.patient_data.name ? dataBinding.patient_data.name.length : 0);
        // logger.debug("Length of diagnosis:", dataBinding.diagnosis ? dataBinding.diagnosis.length : 0);
        // logger.debug("Length of follow_up_advise:", dataBinding.follow_up_advise ? dataBinding.follow_up_advise.length : 0);
        // logger.debug("Length of medicinesArray (if stringified):", JSON.stringify(dataBinding.medicinesArray).length); // Important: stringify if it's an array/object
        // logger.debug("Length of investigations (if stringified):", JSON.stringify(dataBinding.investigations).length);

        const fontPath = path.join(__dirname, '../../../fonts/TiroDevanagariHindi-Regular.ttf'); // Correct Path
        const fontBuffer = fs.readFileSync(fontPath);
        const base64Font = fontBuffer.toString('base64');

        // Launch Puppeteer and generate PDF
        const browser = await puppeteer.launch({
            args: ['--no-sandbox', '--font-render-hinting=medium'],
            headless: true
        });
        const page = await browser.newPage();

        // Set Hindi font support, and ensure proper font rendering
        await page.evaluateHandle((base64Font) => {
            const style = document.createElement('style');
            document.fonts.ready.then(() => {
                document.body.style.visibility = 'visible';
            });
            style.textContent = `
                @font-face {
                    font-family: 'TiroDevanagariHindi-Regular';
                    src: url('data:font/ttf;base64,${base64Font}') format('ttf');
                    font-display: swap;
                }
                * {
                    font-family: 'TiroDevanagariHindi-Regular', 'NotoSansDevanagari', Arial, sans-serif !important;
                }
                .hindi-text {
                    font-family: 'TiroDevanagariHindi-Regular', 'NotoSansDevanagari', Arial, sans-serif !important;
                    -webkit-font-smoothing: antialiased;
                    text-rendering: optimizeLegibility;
                }
            `;
            document.head.appendChild(style);
        }, base64Font);

        // Add font loading wait
        await page.waitForFunction(() => document.fonts.ready);

        // Set the content and viewport
        // Wait for fonts to load
        await page.setContent(finalHtml, {
            waitUntil: ['networkidle0', 'load', 'domcontentloaded'],
            encoding: 'utf-8'
        });

        await page.setViewport({
            width: 794,
            height: 1123,
            deviceScaleFactor: 2,
        });

        // Add a page evaluate to ensure that the page breaks and split within a table are being done correctly
        // This should ensure that the medicine table section breaks are being done correctly
        await page.evaluate(() => {
            const tables = document.querySelectorAll('.medicine_table');

            tables.forEach(table => {
                const rows = table.querySelectorAll('tbody tr');
                let currentPageHeight = 0;
                const pageHeight = 1123; // ADJUST THIS VALUE!

                rows.forEach(row => {
                    currentPageHeight += row.offsetHeight;

                    if (currentPageHeight > pageHeight) {
                        const pageBreak = document.createElement('tr');
                        pageBreak.style.pageBreakBefore = 'always';
                        row.parentNode.insertBefore(pageBreak, row);

                        currentPageHeight = row.offsetHeight;
                    }
                });
            });
        });

        const pdfBuffer = await page.pdf(options);
        logger.info('Conversion complete. PDF file generated successfully.');

        // After processing:
        logger.info('Untranslated labels: \n', missingTranslations);

        // Change the dates back to use 'English' locale
        moment.locale('en'); // Get the date back to 'EN' locale

        // Format dates using moment
        dataBinding.creationDate = moment()
            .locale('en')
            .format('LLL');

        await browser.close();

        const endTime = process.hrtime(startTime);
        logger.info(`PDF generation took ${endTime[ 0 ]}s ${endTime[ 1 ] / 1000000}ms`);

        return pdfBuffer;
    } catch (error) {
        logger.error('Error in PDF generation:', error);
        throw error;
    }
}

// Add these utility functions before your route handler
/**
 * Converts when_to_take value to readable text
 *
 * @param {string|number} whenToTake The when_to_take value from medication
 * @returns {string} Human readable text for when to take medication
 */
function getWhenToTakeText(whenToTake) {
    if (!whenToTake) return '';

    switch (whenToTake) {
        case 1:
            return `Once a day`;
        case 2:
            return `Twice a day`;
        case 3:
            return `Thrice a day`;
        default:
            return "";
    }

    return whenToTake || 'As directed';
}

// formatting doctor data
function formatDoctorsData(
    doctors,
    users,
    degrees,
    registrations,
    providers = {},
    doctor_id
) {
    // const doctorsIds = Object.keys(doctors);
    let degree = "";
    let registrationNumber = "";

    const doctorId = doctor_id;

    const {
        [ doctorId ]: {
            basic_info: {
                user_id = null,
                first_name = "",
                middle_name = "",
                last_name = "",
                signature_image = "",
                profile_pic,
            } = {},
            city = "",
            provider_id,
        } = {},
    } = doctors;

    const {
        [ user_id ]: {
            basic_info: {mobile_number = "", email = "", prefix = ""} = {},
        } = {},
    } = users;

    let providerLogo = "";
    let providerName = "";
    let providerAddress = "";

    let mobileNumber = mobile_number;
    let prefixToShow = prefix;

    logger.debug("Provider Details: ", providers);

    if (Object.keys(providers).length > 0) {
        const {
            basic_info: {user_id: providerUserId, name, address} = {},
            details: {icon: providerIcon} = {},
        } = providers || {};
        providerName = name;
        providerAddress = address;
        providerLogo = providerIcon;

        const {basic_info: {mobile_number, prefix} = {}} =
        users[ providerUserId ] || {};
        mobileNumber = mobile_number;
        prefixToShow = prefix;
    }

    let name = first_name;
    name = middle_name ? `${name} ${middle_name}` : name;
    name = last_name ? `${name} ${last_name}` : name;

    const degreeIds = Object.keys(degrees);
    for (const id of degreeIds) {
        const {[ id ]: {basic_info: {name: degreeName = ""} = {}} = {}} =
            degrees;
        degree = degreeName ? degree + `${degreeName}, ` : degree;
    }

    const registrationIds = Object.keys(registrations);
    for (const regId of registrationIds) {
        const {
            [ regId ]: {
                number = "",
                council: {basic_info: {name: council_name = ""} = {}} = {},
            } = {},
        } = registrations;
        registrationNumber = registrationNumber + `${number}, `;
    }

    if (degree) {
        degree = degree.substring(0, degree.length - 2);
    }

    if (registrationNumber) {
        registrationNumber = registrationNumber.substring(
            0,
            registrationNumber.length - 2
        );
    }

    return {
        name,
        email,
        mobile_number: mobileNumber,
        city,
        degree,
        registrationNumber,
        signature_image,
        prefix: prefixToShow,
        providerLogo,
        providerName,
        providerAddress,
    };
}

// formatting patients data
function formatPatientData(patients, users) {
    const patientIds = Object.keys(patients);

    const patientId = patientIds[ 0 ];
    logger.debug(JSON.stringify({patients, users}));
    const {
        [ patientId ]: {
            basic_info: {
                gender = "",
                age = "",
                first_name = "",
                middle_name = "",
                last_name = "",
                address = "",
                height = "",
                weight = "",
                user_id = null,
                full_name = "",
                uid = "",
            } = {},
            details: {allergies = "", comorbidities = ""} = {},
            created_at = "",
        } = {},
    } = patients;

    let name = first_name;
    name = middle_name ? `${name} ${middle_name}` : name;
    name = last_name ? `${name} ${last_name}` : name;

    const {
        [ user_id ]: {basic_info: {mobile_number = "", prefix = ""} = {}} = {},
    } = users;

    return {
        name,
        age,
        gender,
        address,
        height,
        weight,
        allergies,
        comorbidities,
        mobile_number,
        prefix,
        uid,
        created_at: `${moment(new Date(created_at))
            .tz("Asia/Kolkata")
            .format("DD MMM 'YY, hh:mm A")}`,
    };
}

// formated care plan data
function formatCarePlanData(carePlans, conditions) {
    let condition = "",
        diagnosis = "",
        symptoms = "",
        clinicalNotes = "",
        carePlanId = null;
    const conditionIds = Object.keys(conditions);
    if (conditionIds && conditionIds.length) {
        const conditionId = conditionIds[ 0 ];
        const {[ conditionId ]: {basic_info: {name = ""} = {}} = {}} =
            conditions;
        condition = name;
    }

    const carePlanIds = Object.keys(carePlans);
    if (carePlanIds && carePlanIds.length) {
        carePlanId = carePlanIds[ 0 ];
        const {
            [ carePlanId ]: {
                details: {
                    symptoms: symptom = "",
                    diagnosis: {description = ""} = {},
                    clinical_notes = "",
                } = {},
            },
        } = carePlans;

        diagnosis = description;
        symptoms = symptom ? symptom : "";
        clinicalNotes = clinical_notes;
    }

    return {condition, diagnosis, symptoms, clinicalNotes, carePlanId};
}

function renderChiefComplaints({symptoms}) {
    try {
        let finalSymptom = "";

        if (
            symptoms === undefined ||
            symptoms === null ||
            ( typeof symptoms === "object" && Object.keys(symptoms).length === 0 ) ||
            ( typeof symptoms === "string" && symptoms.trim().length === 0 )
        ) {
            finalSymptom = "";
        } else {
            finalSymptom = symptoms;
        }

        return finalSymptom;
    } catch (err) {
        logger.error("Error in chief Compliance: ", err);
    }
}

/**
 * Formats medications data for PDF generation
 *
 * @param medications
 * @param medicines
 * @returns {*[]}
 */
function formatMedicationsData(medications, medicines) {
    // have to send the list of objects containing instruction medicine name, medicine type, strength, frequency, duration,
    let medicationsList = [];

    const medicationIds = Object.keys(medications);
    let date = null;
    for (const medicationId of medicationIds) {
        let medicationDataObj = {};
        const {
            [ medicationId ]: {
                basic_info: {
                    start_date = "",
                    end_date = "",
                    description = "",
                    details = null,
                    updated_at,
                } = {},
                details: mobileDetails = null,
                organizer,
            },
        } = medications;
        let repeat_days = medications[ medicationId ].basic_info.details.repeat_days;
        let mainDetails = {};

        if (mobileDetails) {
            mainDetails = {...mobileDetails};
        } else {
            mainDetails = {...details};
        }

        const {
            medicine_id = null,
            when_to_take = [],
            medicine_type = "",
            strength = "",
            unit = "",
            quantity = null,
            description: detailDescription = "",
        } = mainDetails || {};

        const {
            [ medicine_id ]: {
                basic_info: {name = "", type = ""} = {},
                details: medicineExtraDetails = {},
            } = {},
        } = medicines || {};
        const {generic_name = ""} = medicineExtraDetails || {};

        const startDateObj = moment(start_date);

        // const duration = endDateObj.diff(startDateObj, "days");

        const startDate = `${startDateObj.format("LL")}`;
        let endDate = "";

        if (end_date) {
            const endDateObj = moment(end_date);
            // New Changes - adding an end date in the prescription
            endDate = end_date;

            // Removed the option to generate the end date
            // endDate = `${endDateObj.get("year")}/${endDateObj.get(
            //   "month"
            // )}/${endDateObj.get("date")}`;
        }

        const {[ unit ]: {text = ""} = {}} = DOSE_UNIT;
        const unitToShow = text ? text : unit;
        let newVar = unit === "3" ? "One" : strength;

        medicationDataObj = {
            description: description || detailDescription,
            medicineName: name ? name.toUpperCase() : name,
            genericName: generic_name,
            medicineType: categories.items.find((x) => x.id == medicine_type).name,
            // strength,
            strength: `${`${strength} ${unitToShow.toUpperCase()}`}`,
            quantity,
            organizer,
            frequency: getWhenToTakeText(when_to_take.length),
            startDate,
            endDate,
            timings: getWhenToTakeTimings(when_to_take),
            timings_new: getWhenToTakeTimingsNew(when_to_take),
            dosage: getWhenToTakeDosage(when_to_take),
            duration: end_date
                ? moment(end_date).diff(moment(start_date), "days") + 1
                : "Long term", // todo: change text here after discussion
            repeat_days,
            unit:
                unitToShow === "3"
                    ? "One"
                    : `${`${strength} ${unitToShow.toUpperCase()}`}`, //unitToShow.toUpperCase(),

            isSOS: getWhenToTakeTimings(when_to_take) == "",
        };

        medicationsList.push(medicationDataObj);
    }

    return medicationsList;
}

const getWhenToTakeTimingsNew = (when_to_take = []) => {
    let morning = [];
    let afternoon = [];
    let night = [];

    for (let i in when_to_take) {
        if (["0", "1", "2", "3"].includes(when_to_take[ i ]))
            morning.push(MEDICATION_TIMING[ when_to_take[ i ] ].text);
        if (["4", "5", "6", "7", "8"].includes(when_to_take[ i ]))
            afternoon.push(MEDICATION_TIMING[ when_to_take[ i ] ].text);
        if (["9", "10", "11", "12"].includes(when_to_take[ i ]))
            night.push(MEDICATION_TIMING[ when_to_take[ i ] ].text);
    }
    return {morning, afternoon, night};
};

const getWhenToTakeTimings = (when_to_take = []) => {
    return when_to_take.map((id) => MEDICATION_TIMING[ id ].text).join(", ");
};

const getWhenToTakeDosage = (when_to_take) => {
    switch (when_to_take.length) {
        case WHEN_TO_TAKE_ABBREVATIONS.OD:
            return "Once a day";
        case WHEN_TO_TAKE_ABBREVATIONS.BD:
            return "Twice a day";
        case WHEN_TO_TAKE_ABBREVATIONS.TDS:
            return "Thrice a day";
        case WHEN_TO_TAKE_ABBREVATIONS.SOS:
            return "Whenever required";
        default:
            return null;
    }
};

function getLatestUpdateDate(medications) {
    const medicationIds = Object.keys(medications);
    let date = null;
    let isPrescriptionUpdated = false;
    for (const medicationId of medicationIds) {
        const {
            [ medicationId ]: {
                basic_info: {updated_at} = {},
                details: mobileDetails = null,
            },
        } = medications;
        let newdate = new Date(updated_at);

        if (date == null) {
            date = newdate;
        } else if (newdate > date) {
            date = newdate;
            isPrescriptionUpdated = true;
        }
    }
    return {date, isPrescriptionUpdated};
}

/**
 * @swagger
 */
router.get(
    "/details/:care_plan_id/:language",
    Authenticated,
    async (req, res) => {

        // const pdfGenerator = new PDFGenerator();
        // await pdfGenerator.loadLocalTranslations();

        try {
            const { care_plan_id = null, language = 'en' } = req.params; // Destructure both parameters
            logger.debug("Care Plan ID: ", care_plan_id);

            const {
                userDetails: {
                    userId,
                    userRoleId = null,
                    userData: {category} = {},
                } = {},
                permissions = [],
            } = req;

            const dietService = new DietService();
            const workoutService = new WorkoutService();
            // const carePlanId = parseInt(care_plan_id);
            let doctor_id = "";
            let dataForPdf = {};

            let usersData = {};
            let userRolesData = {};
            let qualifications = {};
            let degrees = {};
            let registrationsData = {};
            let conditions = {};
            let medications = {};
            let medicines = {};
            let medicinesArray = [];
            let nextAppointmentDuration = null;
            if (!care_plan_id) {
                return raiseClientError(res, 422, {}, "Invalid Care Plan!");
            }
            const carePlan = await carePlanService.getCarePlanById(care_plan_id);
            const carePlanData = await CarePlanWrapper(carePlan);
            const {clinical_notes, follow_up_advise} =
            ( await carePlanData.getCarePlanDetails() ) || {};

            const curr_patient_id = carePlanData.getPatientId();
            const doctorUserRoleId = carePlanData.getUserRoleId();
            const userRoles = await userRolesService.getSingleUserRoleByData({
                id: doctorUserRoleId,
            });
            if (userRoles) {
                const userRolesWrapper = await UserRolesWrapper(userRoles);
                userRolesData = {
                    ...userRolesData,
                    [ doctorUserRoleId ]: userRolesWrapper.getBasicInfo(),
                };
            }
            const carePlanCreatedDate = carePlanData.getCreatedAt();
            const {
                details: {condition_id = null} = {},
                medication_ids = [],
                appointment_ids = [],
                diet_ids = [],
                workout_ids = [],
            } = await carePlanData.getAllInfo();

            const conditionData = await conditionService.getByData({
                id: condition_id,
            });

            if (conditionData) {
                const condition = await ConditionWrapper(conditionData);
                conditions[ condition_id ] = condition.getBasicInfo();
            }

            for (const medicationId of medication_ids) {
                const medication = await medicationReminderService.getMedication({
                    id: medicationId,
                });

                if (medication) {
                    const medicationWrapper = await MReminderWrapper(medication);
                    const medicineId = medicationWrapper.getMedicineId();
                    const medicineData = await medicineService.getMedicineByData({
                        id: medicineId,
                    });

                    for (const medicine of medicineData) {
                        const medicineWrapper = await MedicineApiWrapper(medicine);
                        medicines = {
                            ...medicines,
                            ...{
                                [ medicineWrapper.getMedicineId() ]: medicineWrapper.getAllInfo(),
                            },
                        };
                    }

                    let medicationNewData = await medicationWrapper.getBasicInfo();

                    medications = {
                        ...medications,
                        ...{[ medicationId ]: await medicationWrapper.getBasicInfo()},
                    };
                    medicinesArray.push(await medicationWrapper.getBasicInfo());
                }
            }
            // }

            const now = moment();
            let nextAppointment = null;

            let suggestedInvestigations = [];
            for (const appointmentId of appointment_ids) {
                const appointment = await appointmentService.getAppointmentById(
                    appointmentId
                );

                if (appointment) {
                    const appointmentWrapper = await AppointmentWrapper(appointment);

                    const startDate = appointmentWrapper.getStartTime();
                    const startDateObj = moment(startDate);
                    const {organizer, provider_id} =
                        await appointmentWrapper.getBasicInfo();
                    const diff = startDateObj.diff(now);

                    if (diff > 0) {
                        if (!nextAppointment || nextAppointment.diff(startDateObj) > 0) {
                            nextAppointment = startDateObj;
                        }
                    }

                    const {type} = appointmentWrapper.getDetails() || {};

                    // if (type !== CONSULTATION) {
                    const {
                        type_description = "",
                        radiology_type = "",
                        description = "",
                        reason = "",
                    } = appointmentWrapper.getDetails() || {};
                    suggestedInvestigations.push({
                        type,
                        description,
                        type_description,
                        radiology_type,
                        provider_id,
                        start_date: `${moment(new Date(startDate)).format("DD MMM 'YY")}`,
                        organizer,
                        reason,
                    });
                    // }
                }
            }

            let dietApiData = {},
                dietIds = [],
                workoutApiData = {},
                workoutIds = [],
                dietList = [],
                workoutlist = [];

            // diet
            for (const id of diet_ids) {
                const diet = await dietService.getByData({id});

                if (diet) {
                    const dietData = await dietService.findOne({id});
                    const dietWrapper = await DietWrapper({data: dietData});
                    const expired_on = await dietWrapper.getExpiredOn();
                    if (expired_on) {
                        continue;
                    }
                    dietList.push(dietWrapper);

                    const referenceInfo = await dietWrapper.getReferenceInfo();

                    let dietFoodGroupsApidata = {},
                        dietBasicInfo = {};

                    dietBasicInfo[ dietWrapper.getId() ] = await dietWrapper.getBasicInfo();

                    const {
                        diet_food_group_mappings = {},
                        food_groups = {},
                        food_items = {},
                        food_item_details = {},
                    } = referenceInfo || {};

                    const timeWise = await DietHelper.getTimeWiseDietFoodGroupMappings({
                        diet_food_group_mappings,
                    });

                    for (let eachTime in timeWise) {
                        const {mappingIds = []} = timeWise[ eachTime ] || {};

                        for (let ele of mappingIds) {
                            let primary = null,
                                related_diet_food_group_mapping_ids = [];

                            if (Array.isArray(ele)) {
                                ele.sort(function (a, b) {
                                    return a - b;
                                });

                                primary = ele[ 0 ] || null;
                                related_diet_food_group_mapping_ids = ele.slice(1);
                            } else {
                                primary = ele;
                            }

                            let currentFormattedData = {};

                            // const related_diet_food_group_mapping_ids = mappingIds.slice(1);
                            let similarFoodGroups = [],
                                notes = "";

                            const current_mapping = diet_food_group_mappings[ primary ] || {};
                            const {basic_info: {time = "", food_group_id = null} = {}} =
                                current_mapping;
                            const {
                                basic_info: {food_item_detail_id = null, serving = null} = {},
                                details = {},
                            } = food_groups[ food_group_id ] || {};
                            const {basic_info: {portion_id = null} = {}} =
                            food_item_details[ food_item_detail_id ] || {};

                            if (details) {
                                const {notes: detail_notes = ""} = details;
                                notes = detail_notes;
                            }
                            if (related_diet_food_group_mapping_ids.length) {
                                for (
                                    let i = 0;
                                    i < related_diet_food_group_mapping_ids.length;
                                    i++
                                ) {
                                    const similarMappingId = related_diet_food_group_mapping_ids[ i ];

                                    const {
                                        basic_info: {
                                            food_group_id: similar_food_group_id = null,
                                        } = {},
                                    } = diet_food_group_mappings[ similarMappingId ] || {};
                                    const {
                                        basic_info: {
                                            food_item_detail_id: similar_food_item_detail_id = null,
                                            serving: similar_serving = null,
                                        } = {},
                                        details: similar_details = {},
                                    } = food_groups[ similar_food_group_id ] || {};

                                    const {
                                        basic_info: {portion_id: similar_portion_id = null} = {},
                                    } = food_item_details[ similar_food_item_detail_id ] || {};

                                    let similar_notes = "";
                                    if (similar_details) {
                                        const {notes = ""} = similar_details || {};
                                        similar_notes = notes;
                                    }

                                    const similarData = {
                                        serving: similar_serving,
                                        portion_id: similar_portion_id,
                                        food_item_detail_id: similar_food_item_detail_id,
                                        food_group_id: similar_food_group_id,
                                        notes: similar_notes,
                                    };

                                    similarFoodGroups.push(similarData);
                                    // delete diet_food_group_mappings[similarMappingId];
                                }
                            }

                            currentFormattedData = {
                                serving,
                                portion_id,
                                food_group_id,
                                notes,
                                food_item_detail_id,
                                similar: [...similarFoodGroups],
                            };

                            const currentDietDataForTime = dietFoodGroupsApidata[ time ] || [];
                            currentDietDataForTime.push(currentFormattedData);

                            dietFoodGroupsApidata[ `${time}` ] = [...currentDietDataForTime];
                            // dietFoodGroupsApidata["food_details"] = food_item_details[dietFoodGroupsApidata["food_item_detail_id"]]
                        }
                    }
                    let diet_food_groups = {
                        ...dietFoodGroupsApidata,
                    };

                    let this_diet_data = {
                        diets: {
                            ...dietBasicInfo,
                        },
                        diet_food_groups,
                        food_items,
                        food_item_details,
                    };

                    dietList.push(this_diet_data);
                    dietApiData[ id ] = this_diet_data;
                    dietIds.push(id);
                }
            }
            // logger.debug("Diet Lists and Diet IDs: ", JSON.stringify(dietList), {dietIds});

            for (const id of workout_ids) {
                const workout = await workoutService.findOne({id});

                if (workout) {
                    const workoutWrapper = await WorkoutWrapper({data: workout});
                    const expired_on = await workoutWrapper.getExpiredOn();
                    if (expired_on) {
                        continue;
                    }

                    let workout_exercise_groups = [];
                    const {exercises, exercise_groups, exercise_details} =
                        await workoutWrapper.getReferenceInfo();

                    for (const exerciseGroupId of Object.keys(exercise_groups)) {
                        const {
                            basic_info: {id: exercise_group_id, exercise_detail_id} = {},
                            sets,
                            details = {},
                        } = exercise_groups[ exerciseGroupId ] || {};

                        const {basic_info: {exercise_id} = {}} =
                        exercise_details[ exercise_detail_id ] || {};

                        workout_exercise_groups.push({
                            exercise_group_id,
                            exercise_detail_id,
                            sets,
                            ...details,
                        });
                    }
                    let this_workout_data = {
                        ...( await workoutWrapper.getReferenceInfo() ),
                        workout_exercise_groups,
                    };
                    workoutlist.push(this_workout_data);
                    workoutApiData[ workoutWrapper.getId() ] = this_workout_data;

                    workoutIds.push(workoutWrapper.getId());
                }
            }

            // Changed to avoid warning from moment:
            // Deprecation warning: value provided is not in a recognized RFC2822 or ISO format.
            // moment construction falls back to js Date()
            /**
             * TODO: Check if the below new function returns correct date, or revert to the original one
             const sortedInvestigations = suggestedInvestigations.sort((a, b) => {
             const {start_date: aStartDate} = a || {};
             const {start_date: bStartDate} = b || {};
             if (moment(bStartDate).diff(moment(aStartDate), "minutes") > 0) {
             return 1;
             } else {
             return -1;
             }
             });
             */
            const sortedInvestigations = suggestedInvestigations.sort((a, b) => {
                const {start_date: aStartDate} = a || {};
                const {start_date: bStartDate} = b || {};

                const momentA = moment(aStartDate, 'Do MMM YY');
                const momentB = moment(bStartDate, 'Do MMM YY');

                if (!momentA.isValid() || !momentB.isValid()) {
                    // Handle invalid dates.  What should the sort order be if a date is bad?
                    // Example: Put invalid dates at the end
                    return momentA.isValid() ? -1 : 1; // Or return 0 to keep original order
                }

                return momentB.diff(momentA, "minutes");
            });

            if (nextAppointment) {
                nextAppointmentDuration =
                    nextAppointment.diff(now, "days") !== 0
                        ? `${nextAppointment.diff(now, "days")} days`
                        : `${nextAppointment.diff(now, "hours")} hours`;
            }

            let patient = null;

            if (category === USER_CATEGORY.DOCTOR) {
                patient = await patientService.getPatientById({id: curr_patient_id});
                doctor_id = req.userDetails.userCategoryData.basic_info.id;
            } else if (category === USER_CATEGORY.HSP) {
                patient = await patientService.getPatientById({id: curr_patient_id});
                ( {doctor_id} = await carePlanData.getReferenceInfo() );
            } else {
                patient = await patientService.getPatientByUserId(userId);
                ( {doctor_id} = await carePlanData.getReferenceInfo() );
            }

            const patientData = await PatientWrapper(patient);

            const timingPreference = await userPreferenceService.getPreferenceByData({
                user_id: patientData.getUserId(),
            });
            const userPrefOptions = await UserPreferenceWrapper(timingPreference);
            const {timings: userTimings = {}} = userPrefOptions.getAllDetails();
            const timings = DietHelper.getTimings(userTimings);

            // const { doctors, doctor_id } = await carePlanData.getReferenceInfo();
            const {doctors} = await carePlanData.getReferenceInfo();

            const {
                [ doctor_id ]: {
                    basic_info: {signature_pic = "", full_name = "", profile_pic} = {},
                } = {},
            } = doctors;

            checkAndCreateDirectory(S3_DOWNLOAD_FOLDER);

            const doctorSignImage = `${S3_DOWNLOAD_FOLDER}/${full_name}.jpeg`;

            const downloadImage = await downloadFileFromS3(
                getFilePath(signature_pic),
                doctorSignImage
            );

            const doctorQualifications =
                await qualificationService.getQualificationsByDoctorId(doctor_id);

            await doctorQualifications.forEach(async (doctorQualification) => {
                const doctorQualificationWrapper = await QualificationWrapper(
                    doctorQualification
                );
                const degreeId = doctorQualificationWrapper.getDegreeId();
                const degreeWrapper = await DegreeWrapper(null, degreeId);
                degrees[ degreeId ] = degreeWrapper.getBasicInfo();
            });

            const doctorRegistrations =
                await doctorRegistrationService.getRegistrationByDoctorId(doctor_id);

            for (const doctorRegistration of doctorRegistrations) {
                const registrationData = await RegistrationWrapper(doctorRegistration);
                const council_id = registrationData.getCouncilId();
                const councilWrapper = await CouncilWrapper(null, council_id);

                const regData = registrationData.getBasicInfo();
                const {basic_info: {number = ""} = {}} = regData;
                registrationsData[ registrationData.getDoctorRegistrationId() ] = {
                    number,
                    council: councilWrapper.getBasicInfo(),
                };
            }

            const {
                [ `${doctor_id}` ]: {basic_info: {user_id: doctorUserId = null} = {}},
            } = doctors;

            let user_ids = [doctorUserId, userId];
            if (category === USER_CATEGORY.DOCTOR || category === USER_CATEGORY.HSP) {
                const curr_data = await patientData.getAllInfo();
                const {basic_info: {user_id: curr_p_user_id = ""} = {}} =
                curr_data || {};
                user_ids = [doctorUserId, curr_p_user_id];
            }

            for (const id of user_ids) {
                const intId = parseInt(id);
                const user = await userService.getUserById(intId);

                if (user) {
                    const userWrapper = await UserWrapper(user.get());
                    usersData = {...usersData, ...{[ id ]: userWrapper.getBasicInfo()}};
                }
            }

            // provider data
            const {
                [ doctorUserRoleId ]: {
                    basic_info: {linked_id: provider_id = null} = {},
                } = {},
            } = userRolesData || {};

            let providerData = {};

            let providerIcon = "";
            let providerPrescriptionDetails = "";
            if (provider_id) {
                const providerWrapper = await ProviderWrapper(null, provider_id);
                const {providers, users} = await providerWrapper.getReferenceInfo();

                const {details: {icon = null, prescription_details = ""} = {}} =
                providers[ provider_id ] || {};
                checkAndCreateDirectory(S3_DOWNLOAD_FOLDER_PROVIDER);
                providerPrescriptionDetails = prescription_details;
                if (icon) {
                    providerIcon = `${S3_DOWNLOAD_FOLDER_PROVIDER}/provider-${provider_id}-icon.jpeg`;

                    const downloadProviderImage = await downloadFileFromS3(
                        getFilePath(icon),
                        providerIcon
                    );
                }
                providerData = {...providers[ provider_id ]};
                // logger.debug("Providers Data: ", {providerData});
                usersData = {...usersData, ...users};
            }

            const portionServiceService = new PortionServiceService();
            const allPortions = await portionServiceService.getAll();
            let portionApiData = {};

            for (let each in allPortions) {
                const portion = allPortions[ each ] || {};
                const portionWrapper = await PortionWrapper({data: portion});
                portionApiData[ portionWrapper.getId() ] = portionWrapper.getBasicInfo();
            }

            const repetitionService = new RepetitionService();
            let repetitionApiData = {};

            const {count, rows: repetitions = []} =
            ( await repetitionService.findAndCountAll() ) || {};
            if (count) {
                for (let index = 0; index < repetitions.length; index++) {
                    const {id, type} = repetitions[ index ] || {};
                    repetitionApiData[ id ] = {id, type};
                }
            }
            logger.debug("Doctor ID: ", doctor_id);
            // logger.debug("Doctors: ", doctors);
            // logger.debug("Medicines Array Data: \n", {medicinesArray});

            const {
                name: doctorName = "",
                city = "",
                degree = "",
                registrationNumber = "",
                email: doctorEmail = "",
                mobile_number: doctorMobileNumber = "",
                prefix = "",
                providerLogo = "",
                providerName = "",
                providerAddress = "",
            } = formatDoctorsData(
                doctors,
                {...usersData},
                degrees,
                registrationsData,
                providerData,
                doctor_id
            );

            // logger.debug("Provider logo: \n", {providerLogo});

            let patient_data = formatPatientData(
                {
                    ...{[ patientData.getPatientId() ]: patientData.getBasicInfo()},
                },
                {...usersData}
            );

            const {diagnosis, condition, symptoms, clinicalNotes} =
                formatCarePlanData(
                    {
                        [ carePlanData.getCarePlanId() ]: {
                            ...carePlanData.getBasicInfo(),
                        },
                    },
                    conditions
                );

            let stringSymptomArray = [];
            let stringSymptom = "";

            if (symptoms) {
                try {
                    let object = JSON.parse(symptoms);
                    object.forEach((element) => {
                        let symName = element.symptomName;
                        let bodyPart =
                            element.bodyParts.length > 0
                                ? `(${String(element.bodyParts)})`
                                : "";
                        let duration = element.duration;
                        stringSymptomArray.push(`${symName} ${bodyPart} for ${duration}`);
                    });
                } catch (e) {
                    stringSymptom = symptoms;
                }
            }

            let symptoms_final_value = "";
            if (stringSymptomArray.length < 1) {
                symptoms_final_value = `${renderChiefComplaints({
                    symptoms: stringSymptom,
                })}`;
            } else {
                for (let i = 0; i < stringSymptomArray.length; i++) {
                    symptoms_final_value += `${stringSymptomArray[ i ]}` + "\n";
                }
            }
            let investigations = [];
            let nextConsultation = [];
            suggestedInvestigations = sortedInvestigations;

            for (let each in suggestedInvestigations) {
                const {type} = suggestedInvestigations[ each ] || {};
                if (APPOINTMENT_TYPE[ type ].title !== "Consultation") {
                    investigations.push(suggestedInvestigations[ each ]);
                    continue;
                }
                nextConsultation.push(suggestedInvestigations[ each ]);
            }

            const medicationsList = formatMedicationsData(medications, medicines);
            // logger.debug("Medications List: \n", JSON.stringify(medicationsList));
            // logger.debug("Diet API Data: \n", {data: JSON.stringify({...dietApiData})});

            let diet_old_data = {...dietApiData};
            let diet_output = [];

            for (let i in dietIds) {
                let food_group = [];
                let dietobj = {};
                let formattedStartDate = "";
                let formattedEndDate = "";
                let diet_id = dietIds[ i ];
                let start_date = diet_old_data[ diet_id ][ "diets" ][ diet_id ][ "basic_info" ][ "start_date" ];
                let end_date = diet_old_data[ diet_id ][ "diets" ][ diet_id ][ "basic_info" ][ "end_date" ];

                // logger.debug("Diet data + Basic Info: \n", diet_old_data[ diet_id ][ "diets" ][ diet_id ][ "basic_info" ]);

                if (start_date) formattedStartDate = moment(start_date);
                if (end_date) formattedEndDate = moment(end_date);

                let duration = null;
                let durationText = "";
                if (end_date) {
                    duration = formattedEndDate.diff(formattedStartDate, "days");
                    durationText = `${duration}${" "}days`;
                    if (duration >= 7) {
                        const weeks = Math.floor(duration / 7) || 0;
                        const days = duration % 7 || 0;
                        durationText = `${
                            weeks > 0
                                ? `${weeks}${" "}${weeks > 1 ? "weeks" : "week"}${" "}`
                                : ""
                        }${days > 0 ? `${days}${" "}${days > 1 ? "days" : "day"}` : ""} `;
                    }
                }

                dietobj.name =
                    diet_old_data[ dietIds[ i ] ][ "diets" ][ dietIds[ i ] ][ "basic_info" ][ "name" ];
                dietobj.total_calories =
                    diet_old_data[ dietIds[ i ] ][ "diets" ][ dietIds[ i ] ][ "basic_info" ][
                        "total_calories"
                        ];
                dietobj.not_to_do =
                    diet_old_data[ dietIds[ i ] ][ "diets" ][ dietIds[ i ] ][ "details" ][ "not_to_do" ];
                dietobj.repeat_days =
                    diet_old_data[ dietIds[ i ] ][ "diets" ][ dietIds[ i ] ][ "details" ][
                        "repeat_days"
                        ];
                dietobj.durationText = durationText;
                // for food groups

                for (let key in diet_old_data[ dietIds[ i ] ][ "diet_food_groups" ]) {
                    // logger.debug({
                    //     key,
                    //     old_time: diet_old_data[ dietIds[ i ] ][ "diet_food_groups" ],
                    // });
                    let food_group_obj = {};
                    food_group_obj.time = timings[ key ];
                    food_group_obj.food_group_details_array =
                        diet_old_data[ dietIds[ i ] ][ "diet_food_groups" ][ key ];
                    for (let new_food_item in food_group_obj.food_group_details_array) {
                        // let details = { ...diet_old_data[dietIds[i]]["food_items"][diet_old_data[dietIds[i]]["diet_food_groups"][key][new_food_item]['food_item_detail_id']]["basic_info"], ...diet_old_data[dietIds[i]]["food_item_details"][diet_old_data[dietIds[i]]["diet_food_groups"][key][new_food_item]['food_item_detail_id']] }
                        let fooditemdetail_id =
                            diet_old_data[ dietIds[ i ] ][ "diet_food_groups" ][ key ][ new_food_item ][
                                "food_item_detail_id"
                                ];
                        let food_item_id =
                            diet_old_data[ dietIds[ i ] ][ "food_item_details" ][ fooditemdetail_id ][
                                "basic_info"
                                ][ "food_item_id" ];
                        let details = {
                            ...diet_old_data[ dietIds[ i ] ][ "food_items" ][ food_item_id ][
                                "basic_info"
                                ],
                            ...diet_old_data[ dietIds[ i ] ][ "food_item_details" ][
                                fooditemdetail_id
                                ],
                        };
                        food_group_obj.food_group_details_array[ new_food_item ][ "details" ] =
                            details;
                        food_group_obj.food_group_details_array[ new_food_item ][ "portion" ] =
                            portionApiData[ details[ "basic_info" ][ "portion_id" ] ];
                        // diet_old_data[dietIds[i]]["diet_food_groups"][key][new_food_item]['details'] = diet_old_data[dietIds[i]]["diet_food_groups"][key][new_food_item]['food_item_detail_id']
                    }
                    food_group.push(food_group_obj);
                }
                dietobj.food_group = food_group;
                // dietobj.food_item = diet_old_data[dietIds[i]]["food_items"]["food_item_detail_id"]
                diet_output.push(dietobj);
            }
            // logger.debug("Latest diet object: \n", JSON.stringify(diet_output));
            let {date: prescriptionDate} = getLatestUpdateDate(medications);

            // workout logic here

            let workoutdata = {...workoutApiData};
            let pre_workouts = [];

            for (let i in workoutIds) {
                let {exercise_groups, exercise_details, exercises, repetitions} =
                    workoutdata[ workoutIds[ i ] ];

                let newworkout = {};
                let workout = workoutdata[ workoutIds[ i ] ][ "workouts" ][ workoutIds[ i ] ];
                let {
                    basic_info: {name},
                    end_date,
                    exercise_group_ids,
                    start_date,
                    time,
                    details: {not_to_do, repeat_days},
                } = workout;
                let formattedStartDate = "--",
                    formattedEndDate = "--";

                let ex = [];
                let total_cal = 0;
                for (let exgid in exercise_group_ids) {
                    let ex_group = exercise_groups[ exercise_group_ids[ exgid ] ];
                    let exdetails_id = ex_group[ "basic_info" ][ "exercise_detail_id" ];
                    let {exercise_id, repetition_id, repetition_value} =
                        exercise_details[ exdetails_id ][ "basic_info" ];
                    total_cal += exercise_details[ exdetails_id ][ "calorific_value" ];
                    ex.push({
                        ex_group: ex_group,
                        ex_details: exercise_details[ exdetails_id ],
                        exercises: exercises[ exercise_id ],
                        repetitions: repetitions[ repetition_id ],
                        repetition_value,
                    });
                }
                if (start_date) formattedStartDate = moment(start_date);
                if (end_date) formattedEndDate = moment(end_date);

                const formattedTime = moment(time).tz("Asia/Kolkata").format("hh:mm A");

                let duration = null;
                let durationText = "";

                if (end_date) {
                    duration = formattedEndDate.diff(formattedStartDate, "days");
                    durationText = `${duration}${" "}days`;
                    if (duration >= 7) {
                        const weeks = Math.floor(duration / 7) || 0;
                        const days = duration % 7 || 0;
                        durationText = `${
                            weeks > 0
                                ? `${weeks}${" "}${weeks > 1 ? "weeks" : "week"}${" "}`
                                : ""
                        }${days > 0 ? `${days}${" "}${days > 1 ? "days" : "day"}` : ""} `;
                    }
                } else {
                    durationText = "Long Term";
                }

                pre_workouts.push({
                    ex,
                    total_cal,
                    durationText,
                    duration,
                    name,
                    end_date,
                    start_date,
                    formattedTime,
                    not_to_do,
                    repeat_days,
                });
            }

            prescriptionDate = prescriptionDate || carePlanCreatedDate;
            let pre_data = {
                doctor_id,
                doctorName,
                city,
                degree,
                registrationNumber,
                doctorEmail,
                doctorMobileNumber,
                doctorSignImage: signature_pic,
                prefix,
                providerLogo,
                providerName,
                providerAddress,
                patient_data,
                diagnosis,
                condition,
                symptoms,
                clinicalNotes,
                data: JSON.stringify(patient_data),
                symptoms_final_value,
                medicinesArray,
                clinical_notes,
                follow_up_advise,
                registrations: registrationsData,
                creationDate: moment(prescriptionDate)
                    .add(330, "minutes")
                    .format("Do MMMM YYYY, h:mm a"),
                investigations,
                nextConsultation,
                medicationsList,
                dietFormattedData: {...dietApiData},
                dietIds,
                diet_output,
                pre_workouts,
            };
            // logger.debug("Diet real data, with timings: \n", {data: JSON.stringify({...dietApiData})}, {timings});

            dataForPdf = {
                users: {...usersData},
                /**
                 * TODO: Check why these have been commented, and remove
                 *      Some lines commented below also.
                 ...(permissions.includes(PERMISSIONS.MEDICATIONS.VIEW) && {medications,}),
                 ...(permissions.includes(PERMISSIONS.MEDICATIONS.VIEW) && {medicines,}),
                 medications,
                 clinical_notes,
                 follow_up_advise,
                 clinical_notes,
                 follow_up_advise,
                 */
                medicines,
                care_plans: {
                    [ carePlanData.getCarePlanId() ]: {
                        ...carePlanData.getBasicInfo(),
                    },
                },
                doctors,
                degrees,
                portions: {...portionApiData},
                repetitions: {...repetitionApiData},
                conditions,
                providers: providerData,
                providerIcon,
                providerPrescriptionDetails,
                doctor_id: JSON.stringify(doctor_id),
                // registrations: registrationsData,
                // creationDate: carePlanCreatedDate,
                nextAppointmentDuration,
                // suggestedInvestigations: sortedInvestigations,
                // patients: {
                // ...{ [patientData.getPatientId()]: patientData.getBasicInfo() },
                // },
                diets_formatted_data: {...dietApiData},
                workouts_formatted_data: {...workoutApiData},
                workout_ids: workoutIds,
                diet_ids: dietIds,
                timings,
                currentTime: getDoctorCurrentTime(doctorUserId).format(
                    "Do MMMM YYYY, hh:mm a"
                ),
            };

            const translatedLabels = [];

            pre_data = {
                ...pre_data,
                translatedLabels, // Add translated labels here
            };

            // logger.debug('Pre Load the data sent to PDF conversion: \n', pre_data);

            // Translate the pre_data object
            // const translatedPreData = await translateObjectToHindi(pre_data);

            /**
             * TODO: Not using this, as it gives errors
             // Enhanced PDF options
             const options = {
             format: "A4",
             headerTemplate: "<p></p>",
             footerTemplate: "<p></p>",
             displayHeaderFooter: false,
             scale: 1,
             fontFaces: true,
             margin: {
             top: "40px",
             bottom: "100px",
             },
             printBackground: true,
             preferCSSPageSize: true,
             path: "prescription.pdf",
             translateTo: targetLang // Pass to convertHTMLToPDFHi
             };

             const {buffer: pdfBuffer, metrics} = await pdfGenerator.generatePDF(
             templateHtml,
             pre_data,
             options
             );

             // Log performance metrics
             logger.info('PDF Generation Performance:', pdfGenerator.getPerformanceReport());

             // Set response headers
             res.set({
             'Content-Type': 'application/pdf',
             'Content-Length': pdfBuffer.length,
             'Cache-Control': 'public, max-age=300',
             'X-Generation-Time': metrics[ 'Generate PDF' ]
             });

             return res.send(pdfBuffer);
             */

            // Add language detection (query param or header)
            const targetLang = language; // Ternary operator
            logger.debug("Target Language: ", targetLang);

            // In your route handler, change the dates also to use 'Hindi' locale
            if (targetLang === 'hi') {
                moment.locale('hi'); // Set Hindi locale
            }

            // Format dates using moment
            pre_data.creationDate = moment()
                .locale(targetLang)
                .format('LLL');

            const options = {
                format: "A4",
                headerTemplate: "<p></p>",
                footerTemplate: "<p></p>",
                displayHeaderFooter: false,
                scale: 1,
                fontFaces: true,
                margin: {
                    top: "40px",
                    bottom: "100px",
                },
                printBackground: true,
                path: "prescription.pdf",
                translateTo: targetLang // Pass to convertHTMLToPDFHi
            };

            let pdf_buffer_value = null;

            // Generate PDF with translation
            // TODO: Add a language option here, to use the HINDI or EN function to generate the PDF
            if (targetLang === 'hi') {
                const templateHtml = fs.readFileSync(
                    path.join(__dirname + "/prescription-hindi.html"),
                    "utf8"
                );
                pdf_buffer_value = await convertHTMLToPDFHi({
                    templateHtml,
                    dataBinding: pre_data,
                    options,
                });
            } else if(targetLang === 'en') {
                const templateHtml = fs.readFileSync(
                    path.join(__dirname + "/prescription.html"),
                    "utf8"
                );
                pdf_buffer_value = await convertHTMLToPDFEn({
                    templateHtml,
                    dataBinding: pre_data,
                    options,
                });
            }

            logger.debug("PDF Buffer Value:", pdf_buffer_value); // Log before sending!
            res.contentType("application/pdf");
            if (pdf_buffer_value) { // Check if it's not null or undefined
                return res.send(pdf_buffer_value);
            } else {
                logger.error("PDF buffer is empty. Check PDF generation process.");
                return res.status(500).send("Error generating PDF"); // Send an error response
            }
        } catch (err) {
            logger.error("Error in Prescription API:", err);
            return raiseServerError(res);
        }
    }
);

/**
 * @swagger
 */
router.get("/metrics", Authenticated, async (req, res) => {
    const pdfGenerator = new PDFGenerator();

    const metrics = pdfGenerator.getPerformanceReport();
    res.json(metrics);
});

module.exports = router;
