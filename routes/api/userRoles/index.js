const express = require("express");
const router = express.Router();
import Authenticate from "../middleware/auth";
import userRolesController from "../../../app/controllers/userRoles";

router.get(
    "/switch-role-id",
    Authenticate,
    userRolesController.switchRoleId,
);


router.get(
    "/",
    Authenticate,
    userRolesController.getUserRoles,
);

module.exports = router;
