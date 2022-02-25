import express from "express";
import Authenticate from "../middleware/auth";

import Transactions from "../../../app/controllers/transactions/transaction.controller";

const router = express.Router();

router.get("/", Authenticate, Transactions.getAllTransactions);

export default router;
