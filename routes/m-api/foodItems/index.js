// const express = require("express");
import express from "express";
import Authenticate from "../middlewares/auth";
import FoodItemController from "../../../app/controllers/mControllers/foodtems/foodItems.controller";
import {isDoctor} from "../middlewares/doctor";
import * as Validator from "./validate";

const router = express.Router();

router.post(
    "/",
    Authenticate,
    isDoctor,
    Validator.create,
    FoodItemController.create
);

router.post(
    "/:id",
    Authenticate,
    isDoctor,
    Validator.update,
    FoodItemController.update
);

router.get(
    "/",
    Authenticate,
    isDoctor,
    FoodItemController.search
);

module.exports = router;
