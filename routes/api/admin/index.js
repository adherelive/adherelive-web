import twilioController from "../../../app/controllers/twilio/twilio.controller";
import Authenticate from "../middleware/auth";
import Response from "../../../app/helper/responseFormat";
import { USER_CATEGORY } from "../../../constant";

import Doctor from "../../../app/controllers/doctors/doctor.controller";
import Admin from "../../../app/controllers/admin/admin.controller";
import adminController from "../../../app/controllers/admin/admin.controller";
import Provider from "../../../app/controllers/providers/providers.controller";
import Algolia from "../../../app/controllers/algolia/algolia.controller";
import AccountsController from "../../../app/controllers/accounts/accounts.controller";
import Medicine from "../../../app/controllers/medicines/medicine.controller";
import Graphs from "../../../app/controllers/graphs/graph.controller";
import * as validator from "./validator";

const express = require("express");
const router = express.Router();

router.get("/details/:type", Admin.getTermsAndPolicy);
router.get("/terms_and_conditions/:id", Admin.getTermsAndConditions);

router.use(async (req, res, next) => {
  try {
    const { userDetails } = req;
    const { userData: { category } = {} } = userDetails || {};

    if (
      category !== USER_CATEGORY.ADMIN &&
      category !== USER_CATEGORY.PROVIDER
    ) {
      const response = new Response(false, 401);
      response.setMessage("only admin user can have access to this api");
      return res.status(response.getStatusCode()).json(response.getResponse());
    }
  } catch (error) {
    const response = new Response(false, 500);
    response.setMessage("something went wrong. Please try again later");
    return res.status(response.getStatusCode()).json(response.getResponse());
  }
  next();
});

// ---------------------------- GET ----------------------------

router.get("/doctors", Authenticate, Doctor.getAll);

router.get("/doctors/:id", Authenticate, Doctor.getAllAdminDoctorDetails);

router.get("/providers", Authenticate, Provider.getAllProviders);

router.get(
  "/doctors/:id/account",
  Authenticate,
  AccountsController.getDoctorAccountDetails
);

router.get("/medicines", Authenticate, Medicine.getMedicinesForAdmin);

router.get("/chats", Authenticate, twilioController.getAllChats);

// ---------------------------- POST ----------------------------

router.post(
  "/providers",
  Authenticate,
  validator.validateAddProviderData,
  Provider.addProvider
);

// to add previous providers default graph user preference
router.post("/providers/graphs", Authenticate, Graphs.updateProviderGraph);

router.post(
  "/providers/:id",
  Authenticate,
  validator.validateUpdateProviderData,
  Provider.updateProvider
);

router.post("/doctors/:id", Authenticate, Doctor.verifyDoctors);

router.post("/doctors/:id/account", Authenticate, Doctor.updateRazorpayAccount);

router.post("/details", Authenticate, Admin.updateTermsAndPolicy);
router.post("/algolia/medicine", Authenticate, Algolia.updateMedicine);

router.post(
  "/medicines",
  Authenticate,
  validator.validateAddMedicineData,
  Medicine.addMedicineByAdmin
);

router.post("/medicines/:id/public", Authenticate, Medicine.makeMedicinePublic);

// to enable previous patients features
router.post("/enable-all-features", Authenticate, Admin.enableAllFeatures);

// ---------------------------- DELETE ----------------------------

router.delete("/medicines/:id", Authenticate, Medicine.deleteMedicine);

router.delete("/chats/delete", Authenticate, twilioController.deleteChat);

router.post(
  "/update/provider-terms",
  Authenticate,
  adminController.updateProviderTermsMappingForExistingUsers
);

module.exports = router;
