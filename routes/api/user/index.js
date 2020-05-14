const express = require("express");
const router = express.Router();
const userController = require("../../../app/controllers/user/user.controller");

router.post(
    "/googleSignIn",
    userController.signInGoogle
);

module.exports = router;
