const userModel = require("../models/user");
const programModel = require("../models/program");
const Mongo = require("../../libs/mongo");

(async () => {
  try {
    const mongo = new Mongo();

    var conn = (async function() {
      try {
        const connection = await mongo.getConnection();
      } catch (err) {}
    })();
    let count = 0;
    const year = new Date().getFullYear();
    const program = await programModel.findById("333330303030303030303030");
    const { programCode } = program;
    let users = await userModel.find({
      category: "patient",
      programId: { $in: ["333330303030303030303030"] }
    });
    console.log("users: ", users);
    users.forEach(async user => {
      await userModel.findByIdAndUpdate(user._id, {
        code: programCode + "-" + year + "-" + ++count
      });
    });
    //mongo.disconnectConnection();
  } catch (err) {}
})();
