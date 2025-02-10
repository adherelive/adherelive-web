import express from "express";
import path from "path";
import schedule from "node-schedule";
import cookieSession from "cookie-session";
import cookieParser from "cookie-parser";
import cors from "cors";

import Database from "../libs/mysql";
import initMongo from "../libs/mongo";
// WARN: do not enable this, except on the local development
// import connection from "../libs/dbConnection";
import ApiRouter from "../routes/api";
import mApiRouter from "../routes/m-api";
import EventObserver from "../app/proxySdk/eventObserver";
import ActivityObserver from "../app/activitySdk/activityObserver";

import Start from "../app/cronJobs/start";
import Passed from "../app/cronJobs/passed";
import Prior from "../app/cronJobs/prior";
import ActivePatient from "../app/cronJobs/activePatient";
import RemoveDocuments from "../app/cronJobs/removeDocuments";
// import RenewSubscription from "../app/cronJobs/renewSubscription";
import LongTerm from "../app/cronJobs/longTerm";
import RenewTxActivity from "../app/cronJobs/renewTxActivity";
import { createLogger, requestMiddleware } from '../libs/logger';

const logger = createLogger('app.js');

// Set up the required variables and CORS sessions + cookies
const Events = import("../events")
    .then((module) => {})
    .catch((err) => {
        console.info("Event module error: ", err);
    });

// Create the App as an Express() app
const app = express();
// Create and start the application
//const app = new Application();

// Swagger setup
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('../api-defn/adherelive-api-swagger.json');

// Redis and Cache for PDF setup
const Redis = require('ioredis');
const Bull = require('bull');
const { TranslationService } = require('../routes/api/prescriptions/translation-service');
const { PDFService } = require('../routes/api/prescriptions/pdf-service');
const { QueueService } = require('../routes/api/prescriptions/queue-service');
const { CacheService } = require('../routes/api/prescriptions/cache-service');

class Application {
    constructor() {
        this.app = express();
        this.setupServices();
        this.setupRoutes();
    }

    setupServices() {
        // Initialize services in the correct order
        this.cacheService = new CacheService();
        this.translationService = new TranslationService(this.cacheService);
        this.pdfService = new PDFService(this.translationService);
        this.queueService = new QueueService(this.pdfService);
    }

    setupRoutes() {
        // Set up your API routes with access to all services
        const router = express.Router();

        router.post('/generate-pdf', async (req, res) => {
            try {
                const { templateName, data, language } = req.body;
                // Use the queueService to add the job
                const job = await this.queueService.addPDFJob(
                    templateName,
                    data,
                    language
                );
                res.json({ jobId: job.id });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        // Add more routes as needed
        this.app.use('/api', router);
    }
}

/**
 * Schedule jobs
 * [Schedule job at the start of every month or per day cycle]
 * cron jobs run at every one minute.
 * for now, we have changed it to one hour intervals, due to performance on server
 * Example: const cron = schedule.scheduleJob("* /1 * * * *", async () => {
 */
const monthlyRule = new schedule.RecurrenceRule();
const perDayUtcRule = new schedule.RecurrenceRule();

monthlyRule.dayOfWeek = [new schedule.Range(0, 6)];
monthlyRule.hour = 0;
monthlyRule.minute = 0;
perDayUtcRule.hour = 0;
perDayUtcRule.tz = "Etc/UTC";

const cron = schedule.scheduleJob("0 0 */1 * * *", async () => {
    await Prior.runObserver();
    await Passed.runObserver();
    await Start.runObserver();
});

const removeDocumentPerDayCron = schedule.scheduleJob(
    perDayUtcRule,
    async () => {
      await RemoveDocuments.runObserver();
    }
);

// const perHourCron = schedule.scheduleJob("0 0 */1 * * *", async () => {
schedule.scheduleJob("0 0 */2 * * *", async () => {
    await ActivePatient.runObserver();
    await RenewTxActivity.runObserver();
    await LongTerm.runObserver();
});

// Scheduled job at the start of every month, for the subscriptions
// schedule.scheduleJob(monthlyRule, async () => {
//     await RenewSubscription.runObserver();
// });


// Initialize database connections & event observers
(async () => {
    try {
        await Database.init();
        await initMongo();

        // Initialize event observers
        EventObserver.runObservers();
        ActivityObserver.runObservers();
    } catch (err) {
        console.error("Error during initialization: ", err);
    }
})();

// Configure Redis connection for containerized environment
const redisConfig = {
    host: process.env.REDIS_HOST || 'redis-service',
    port: process.env.REDIS_PORT || 6379,
    // Add retry strategy for container startup order
    retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
    }
};

// Update Redis client configuration
const redis = new Redis(redisConfig);

// Update Bull queue configuration
const pdfQueue = new Bull('pdf-generation', {
    redis: redisConfig,
    // Add settings for containerized environment
    settings: {
        stalledInterval: 30000, // Handle container restarts
        maxStalledCount: 3
    }
});

// Temperature files handling in container
const TEMP_DIR = process.env.TEMP_DIR || '/tmp/pdfs';

// Middleware setup
app.use(express.json({limit: "50mb"}));
app.use(
  express.urlencoded({
    extended: true,
    limit: "50mb",
  })
);
app.use(cookieParser());
app.use(cors());
app.use(requestMiddleware);

// Add error handling middleware
// app.use((err, req, res, next) => {
//     logger.error('Unhandled error', {
//         error: err.message,
//         stack: err.stack,
//         path: req.path,
//         method: req.method
//     });
//     res.status(500).json({ error: 'Internal Server Error!' });
// });

/**
 * Add a check to handle cases where process.config.cookieKey might be undefined or not a valid JSON string
 */
// function generateCookieKey() {
//   return (
//     "key_" + Math.random().toString(36).substr(2) + Date.now().toString(36)
//   );
// }
// console.debug(generateCookieKey());

let cookieKeys = [];

try {
    if (process.config && process.config.cookieKey) {
        cookieKeys = JSON.parse(process.config.cookieKey);
    } else {
        console.warn("process.config.cookieKey is undefined or null");
        // Set a default value if cookieKey is not defined
        cookieKeys = ["cookie938", "abc123xyz456abc789xyz012"];
    }
} catch (error) {
    console.error("Error parsing cookieKey: ", error);
    // Set a default value in case of error
    cookieKeys = ["cookie938", "abc123xyz456abc789xyz012"];
}

// Create a cookie session value - 30 days currently
app.use(
    cookieSession({
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        keys: cookieKeys,
    })
);

// TODO: Remove the code that serves the React frontend
// Serve static files
app.use(express.static(path.join(__dirname, "../public")));

// Configure CORS for your React service
app.use(cors({
    origin: process.env.REACT_APP_URL || 'http://localhost:3000',
    credentials: true
}));

// Setup API routes
app.use("/api", ApiRouter);
app.use("/m-api", mApiRouter);

// Section to enable auto generation of the Swagger documentation for the APIs
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'AdhereLive API Documentation',
            version: '1.0.0',
            description: 'This is the API documentation for the React & Node server AdhereLive application',
        },
    },
    apis: ["../routes/**/*.js"], // Path to your API files
};

// Serve Swagger documentation on /api-docs endpoint
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile, {
    swaggerOptions: {
        persistAuthorization: true,
    },
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: "AdhereLive API Documentation"
}));

// TODO: Use the below, if you want to create and serve it from the locally created JSDoc comments
// const swaggerSpec = swaggerJsDoc(swaggerOptions);
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// For generating the swagger.json file when the server is run
// TODO: This is giving issues currently due to the file path of the app.js file
//       Re-instate, when that issue is rectified
// if (process.env.NODE_ENV === 'development') {
//     require('../api-defn/swagger-docs.js');
// }

// TODO: This is used for the frontend. As we have moved that to a different repository, removing from here.
app.get("/*", (req, res) => {
    res.sendFile(path.resolve("public/index.html"));
});

// Start the server
module.exports = app;
