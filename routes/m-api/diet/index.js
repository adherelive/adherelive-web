const express = require("express");

import Authenticate from "../middlewares/auth";
import Diet from "../../../app/controllers/mControllers/diet/diet.controller";

import dietResponseRouter from "../dietResponses";

const router = express.Router();

router.use("/response", dietResponseRouter);

router.get("/", Authenticate, Diet.getDietsByCareplan);

router.get("/all-diets", Authenticate, Diet.getAllDietsForDoctor);

router.get("/:id/timeline", Authenticate, Diet.getDietResponseTimeline);

router.get("/details/patients/:patient_id", Authenticate, Diet.getDetails);

router.get("/:id", Authenticate, Diet.get);

router.post("/update-calories", Authenticate, Diet.updateTotalCalories);

router.post("/:id", Authenticate, Diet.update);
router.post("/", Authenticate, Diet.create);
router.delete("/:id", Authenticate, Diet.delete);
// router.post(
//     "/",
//     Authenticate,
//     Diet.create
// );

// router.post(
//     "/:id",
//     Authenticate,
//     Diet.update
// );

module.exports = router;
