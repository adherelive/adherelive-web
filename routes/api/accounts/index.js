const express = require("express");
const router = express.Router();
import Authenticate from "../middleware/auth";
import * as validator from "./validator";

import AccountsController from "../../../app/controllers/accounts/accounts.controller";

/**
 * @swagger
 * /accounts:
 *  post:
 *    summary: Retrieve a list of accounts for a application
 *    responses:
 *      200:
 *        description: A list of accounts
 */
router.post(
  "/",
  Authenticate,
  validator.validateAccountFormData,
  AccountsController.addAccountDetails
);

router.post(
  "/:id",
  Authenticate,
  validator.validateAccountFormData,
  AccountsController.addAccountDetails
);

router.get("/", Authenticate, AccountsController.getUserAccountDetails);

router.delete(
  "/:id",
  Authenticate,
  AccountsController.deleteUserAccountDetails
);

module.exports = router;
