import express from "express";
import Authenticated from "../middleware/auth";
import GraphController from "../../../app/controllers/graphs/graph.controller";

import {param} from "express-validator";

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