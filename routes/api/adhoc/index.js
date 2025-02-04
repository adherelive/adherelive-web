import {logger} from "../../../libs/logger";

const express = require("express");
const router = express.Router();

import adhocController from "../../../app/controllers/adhoc/adhoc.controller";
import Authenticated from "../middleware/auth";

router.post("/purge/sqs", Authenticated, adhocController.purgeSqsQueue);

router.post(
  "/populate-user-roles",
  Authenticated,
  adhocController.migrateAllUsersToUserRoles
);

router.post("/test-api", Authenticated, adhocController.testApi);

router.post(
  "/patient/update-timings",
  Authenticated,
  adhocController.updatePatientTimings
);

router.post("/permissions", Authenticated, adhocController.updatePermissions);

router.post(
  "/careplan/channels",
  Authenticated,
  adhocController.updateChannels
);

// In your Node.js backend
app.post('/api/logs', (req, res) => {
    const { level, message, source, sessionId, ...meta } = req.body;

    // Use your backend logger to log the frontend message
    logger[level](message, {
        ...meta,
        source: `frontend:${source}`,
        sessionId
    });

    res.status(200).send({ status: 'logged' });
});

module.exports = router;
