import express from "express";

import Authenticate from "../middlewares/auth";
import MealTemplate from "../../../app/controllers/mControllers/mealTemplate/mealTemplate.controller";
import * as Validator from "./validate";

const router = express.Router();

router.post("/",
    Authenticate,
    Validator.create,
    MealTemplate.create);

router.post("/:id",
    Authenticate,
    Validator.update,
    MealTemplate.update);

router.delete("/:id", 
    Authenticate,
    MealTemplate.delete);

export default router;
// module.exports = router;
