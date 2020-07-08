import express from "express";
import Authenticated from "../middleware/auth";
import GraphController from "../../../app/controllers/graphs/graph.controller";

const router = express.Router();

router.get(
    "/",
    Authenticated,
    GraphController.getAllGraphs
);

router.post(
    "/:id",
    Authenticated,
    //validator
    GraphController.addGraphType
);

module.exports = router;