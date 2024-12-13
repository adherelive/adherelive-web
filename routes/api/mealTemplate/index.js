const express = require("express");
const router = express.Router();

import Authenticate from "../middleware/auth";
import MealTemplate from "../../../app/controllers/mealTemplate/mealTemplate.controller";
import * as Validator from "./validate";

router.post("/", Authenticate, Validator.create, MealTemplate.create);

router.post("/:id", Authenticate, Validator.update, MealTemplate.update);

router.delete("/:id", Authenticate, MealTemplate.delete);

module.exports = router;
