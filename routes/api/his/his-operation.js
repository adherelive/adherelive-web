const express = require("express");
const router = express.Router();
import hisController from "../../../app/controllers/his/his.controller";

router.post("/", hisController.createHis);
router.post("/sign-in", hisController.signIn);

router.get("/", hisController.listAllHis);
router.get("/:id", hisController.getHisById);

router.put("/:id", hisController.updateHis);

router.delete("/:id", hisController.deleteHis);

module.exports = router;
