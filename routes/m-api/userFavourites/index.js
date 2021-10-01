import express from "express";
import Authenticate from "../middlewares/auth";
import UserFavourites from "../../../app/controllers/mControllers/userFavourites/userFavourites.controller";
import * as validate from "./validator";

const router = express.Router();

router.post(
  "/",
  Authenticate,
  validate.validateCreateFavourite,
  UserFavourites.create
);

router.get(
  "/",
  Authenticate,
  validate.validateGetFavourites,
  UserFavourites.getUserTypeFavourites
);

router.delete(
  "/:id",
  Authenticate,
  validate.validateRemoveFavourites,
  UserFavourites.removeFavourite
);

router.delete(
    "/",
    Authenticate,
    UserFavourites.removeFavouriteMedicine
);

module.exports = router;
