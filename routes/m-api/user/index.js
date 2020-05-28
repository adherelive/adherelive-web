const express = require("express");
const router = express.Router();
const mUserController = require("../../../app/controllers/mControllers/user/user.controller");
import Authenticate from "../middleware/auth";


router.post(
    "/sign-in",
    userController.signIn,

);

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
