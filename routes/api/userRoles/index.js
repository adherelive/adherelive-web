const express = require("express");
const router = express.Router();
import Authenticate from "../middleware/auth";
import userRolesController from "../../../app/controllers/userRoles";

router.get(
    "/user-data",
    Authenticate,
    userRolesController.getRoleIdData,
);


router.get(
    "/",
    Authenticate,
    userRolesController.getUserRoles,
);

module.exports = router;
