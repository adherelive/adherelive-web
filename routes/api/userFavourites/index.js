import express from "express";
import Authenticated from "../middleware/auth";
import UserFavourites from "../../../app/controllers/userFavourites/userFavourites.controller";
import * as validate from "./validator";

const router = express.Router();

router.post(
    "/",
    Authenticated,
    // validate.validateCreateFavourite,
    UserFavourites.create
);

router.get(
    "/",
    Authenticated,
    validate.validateGetFavourites,
    UserFavourites.getUserTypeFavourites
);

router.delete(
    "/:id",
    Authenticated,
    // validate.validateRemoveFavourites,
    UserFavourites.removeFavourite
);

router.delete(
    "/",
    Authenticated,
    UserFavourites.removeFavouriteMedicine
);

module.exports = router;
