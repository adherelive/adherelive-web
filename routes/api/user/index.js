const express = require("express");
const router = express.Router();
// const userController = require("../../../app/controllers/user/user.controller");
import Authenticate from "../middleware/auth";
import userController from "../../../app/controllers/user/user.controller";


router.post(
    "/sign-in",
    userController.signIn,
);

router.post(
    "/sign-up",
    userController.signUp,
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

router.post(
    "/upload",
    userController.uploadImage
);

router.post("/sign-out", Authenticate, userController.signOut);

module.exports = router;
