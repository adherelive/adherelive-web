const express = require("express");
const router = express.Router();
import hisController from "../../../app/controllers/his/his.controller";

router.post("/", hisController.createHis);
router.get("/", hisController.listAllHis);
router.get("/:id", hisController.getHisById);
router.update("/:id", hisController.updateHis);

router.delete("/:id", hisController.deleteHis);

router.post("/sign-in", hisController.signIn);

module.exports = router;
