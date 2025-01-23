// FOR TEST
import map from "lodash/map";
import { models } from "../libs/mysql";

const Config = require("../config/config");
Config();

const rollback = async () => {
  return await Promise.all(
    map(models, (key) => {
      console.log("MySQL map models key ---> ", key.db);
      if (["sequelize", "Sequelize"].includes(key)) return null;

      return key.db.destroy({ where: {}, force: true });
    })
  );
};

rollback();

// export default {};
