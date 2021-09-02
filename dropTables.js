// FOR TEST...
const Config = require("./config/config");
Config();

import map from "lodash/map";
import { models } from "./libs/mysql";

const rollback = async () => {
  return await Promise.all(
    map(models, key => {
      console.log("1823982 key --> ", key.db);
      if (["sequelize", "Sequelize"].includes(key)) return null;

      return key.db.destroy({ where: {}, force: true });
    })
  );
};

rollback();
// import database from "./libs/mysql";
//
// export default {};
