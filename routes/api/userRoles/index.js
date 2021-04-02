const express = require("express");
const router = express.Router();
import Authenticate from "../middleware/auth";
import userRolesController from "../../../app/controllers/userRoles";
import * as validator from "./validator";


router.get(
    "/",
    Authenticate,
    userRolesController.getUserRolesData,
);

module.exports = router;
