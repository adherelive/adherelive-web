const express = require("express");
const router = express.Router();
import Authenticate from "../middlewares/auth";
import * as validator from "./validator";

import AccountsController from "../../../app/controllers/mControllers/accounts/accounts.controller";

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

router.get(
  "/:user_id/payments",
  Authenticate,
  AccountsController.getUserAvailablePaymentMethods
);

router.delete(
  "/:id",
  Authenticate,
  AccountsController.deleteUserAccountDetails
);

module.exports = router;
