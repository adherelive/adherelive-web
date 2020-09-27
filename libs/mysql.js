import {Sequelize} from "sequelize";
import Log from "./log";
const Logger = new Log("SEQUELIZE QUERY");

// MODELS
import * as ActionDetails from "../app/models/actionDetails";
import * as Actions from "../app/models/actions";
import * as Adherence from "../app/models/adherence";
import * as Appointments from "../app/models/appointments";

import * as CarePlans from "../app/models/carePlan";
import * as ScheduleEvents from "../app/models/scheduleEvents";
import * as EmailLogger from "../app/models/emailLogger";

const database = new Sequelize(
  process.config.db.name,
  process.config.db.username,
  process.config.db.password,
  {
    host: process.config.db.host,
    port: process.config.db.port,
    dialect: process.config.db.dialect,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    logging: function (str) {
      Logger.debug("query", str);
    }
  }
);

// Models List...
const modelList = [
    ActionDetails,
    Actions,
    Adherence,
    Appointments,
    ScheduleEvents,
    EmailLogger,
    CarePlans,
];

// MODEL INIT...
for (const model of modelList) {
    model.db(database);
}

// ASSOCIATIONS...
// for(const model of modelList) {
//     model.associate(database);
// }

export default database;
