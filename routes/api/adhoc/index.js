const express = require("express");
const router = express.Router();

import adhocController from "../../../app/controllers/adhoc/adhoc.controller";
import Authenticated from "../middleware/auth";

router.post(
    "/purge/sqs",
    Authenticated,
    adhocController.purgeSqsQueue
);

router.post(
    "/populate-user-roles",
    Authenticated,
    adhocController.migrateAllUsersToUserRoles
);

router.post(
    "/test-api",
    Authenticated,
    adhocController.testApi
);

router.post(
    "/patient/update-timings",
    Authenticated,
    adhocController.updatePatientTimings
);

router.post(
    "/permissions",
    Authenticated,
    adhocController.updatePermissions
);

  
module.exports = router;