import express from "express";
import Authenticated from "../middlewares/auth";
import GraphController from "../../../app/controllers/mControllers/graphs/graph.controller";

import { param } from "express-validator";

const router = express.Router();

router.get(
    "/",
    Authenticated,
    GraphController.getAllGraphs
);

router.post(
  "/:id",
  Authenticated,
  [
    param("id")
      .isNumeric()
      .withMessage("Invalid chart type")
  ],
  //validator
  GraphController.addGraphType
);

module.exports = router;
