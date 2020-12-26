import twilioController from "../../../app/controllers/twilio/twilio.controller";

const express = require("express");
const router = express.Router();
import Authenticate from "../middleware/auth";
import Response from "../../../app/helper/responseFormat";
import { USER_CATEGORY } from "../../../constant";

import Doctor from "../../../app/controllers/doctors/doctor.controller";
import Admin from "../../../app/controllers/admin/admin.controller";
import Algolia from "../../../app/controllers/algolia/algolia.controller";
import AccountsController from "../../../app/controllers/accounts/accounts.controller";

router.get("/details/:type", Admin.getTermsAndPolicy);

router.use(async (req, res, next) => {
  try {
    const { userDetails } = req;
    const { userData: { category } = {} } = userDetails || {};

    if (category !== USER_CATEGORY.ADMIN && category !== USER_CATEGORY.PROVIDER) {
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

router.get("/doctors", Authenticate, Doctor.getAll);

router.get("/doctors/:id", Authenticate, Doctor.getAllAdminDoctorDetails);

router.post("/doctors/:id", Authenticate, Doctor.verifyDoctors);

router.post("/doctors/:id/account", Authenticate, Doctor.updateRazorpayAccount);

router.post("/details", Authenticate, Admin.updateTermsAndPolicy);
router.post("/algolia/medicine", Authenticate, Algolia.updateMedicine);

router.get(
  "/doctors/:id/account",
  Authenticate,
  AccountsController.getDoctorAccountDetails
);

router.delete("/chats/delete", Authenticate, twilioController.deleteChat);

module.exports = router;
