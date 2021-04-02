const express = require("express");
const router = express.Router();

import adhocController from "../../../app/controllers/adhoc/adhoc.controller";
import Authenticated from "../middleware/auth";

router.post(
    "/populate-profiles",
    Authenticated,
    adhocController.migrateAllUsersToProfile
);

  
module.exports = router;