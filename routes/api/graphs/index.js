import express from "express";
import Authenticated from "../middleware/auth";
import GraphController from "../../../app/controllers/graphs/graph.controller";

import {check} from "express-validator";

const router = express.Router();

router.get(
    "/",
    Authenticated,
    GraphController.getAllGraphs
);

router.post(
    "/",
    Authenticated,
    [
        check("chart_ids")
            .isArray()
          .withMessage("Chart options sent is not correct") 
    ],
    //validator
    GraphController.addGraphType
);

module.exports = router;