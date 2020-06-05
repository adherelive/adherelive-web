const express = require("express");
const router = express.Router();
const mUserController = require("../../../app/controllers/mControllers/user/user.controller");
import Authenticate from "../middleware/auth";


router.post(
    "/sign-in",
    mUserController.signIn,

);

router.get(
    "/get-basic-info",
    Authenticate,
    mUserController.onAppStart,
);

router.post(
    "/googleSignIn",
    mUserController.signInGoogle
);

router.post(
    "/facebookSignIn",
    mUserController.signInFacebook
);

module.exports = router;
