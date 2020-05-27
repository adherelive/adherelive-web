const express = require("express");
const router = express.Router();
const userController = require("../../../app/controllers/user/user.controller");
import Authenticate from "../middleware/auth";

router.get(
    "/get-basic-info",
    Authenticate,
    userController.onAppStart,
);

router.post(
    "/googleSignIn",
    userController.signInGoogle
);

router.post(
    "/facebookSignIn",
    userController.signInFacebook
);

module.exports = router;
