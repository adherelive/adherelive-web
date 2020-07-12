const express = require("express");
const router = express.Router();
import Authenticate from "../middleware/auth";
import Response from "../../../app/helper/responseFormat";
import {USER_CATEGORY} from "../../../constant";

import Doctor from "../../../app/controllers/doctors/doctor.controller";

router.use(async (req, res, next) => {
    try {
        const {userDetails} = req;
        const {userData: {category} = {}} = userDetails || {};

        if(category !== USER_CATEGORY.ADMIN) {
            const response = new Response(false, 401);
            response.setMessage("only admin user can have access to this api");
            return res.status(response.getStatusCode()).json(response.getResponse());
        }
    } catch(error) {
        const response = new Response(false, 500);
        response.setMessage("something went wrong. Please try again later");
        return res.status(response.getStatusCode()).json(response.getResponse());
    }
    next();
});

router.get(
    "/doctors",
    Authenticate,
    Doctor.getAll
);

router.get(
    "/doctors/:id",
    Authenticate,
    Doctor.getAllDoctorDetails
)

router.post(
    "/doctors/:id",
    Authenticate,
    Doctor.verifyDoctors
);

module.exports = router;