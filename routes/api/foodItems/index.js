// const express = require("express");
import express from "express";
import Authenticate from "../middleware/auth";
import FoodItemController from "../../../app/controllers/foodtems/foodItems.controller";
import { isDoctor } from "../middleware/doctor";
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

router.get("/", Authenticate, isDoctor, FoodItemController.search);

// get all & on permission basis

module.exports = router;
