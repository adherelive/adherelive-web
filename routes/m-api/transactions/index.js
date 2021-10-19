import express from "express";
import Authenticate from "../middlewares/auth";
import TransactionController from "../../../app/controllers/mControllers/transactions/transaction.controller";
import * as validator from "./validator";

const router = express.Router();

router.post(
    "/",
    Authenticate,
    // validator.validatePaymentOrderData,
    TransactionController.createOrder
);

router.post(
    "/:id",
    Authenticate,
    // validator.validateTransactionUpdateData,
    TransactionController.processTransaction
);

export default router;