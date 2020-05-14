import Sequelize from "sequelize";

// export const database = new Sequelize("adhere", "user", "password", {
//   host: "mysql",
//   dialect: "mysql"
// });
console.log("mysql ---------- ", process.config.db.dialect);

export const database = new Sequelize(
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
    }
  }
);

export default () => {
  database
    .authenticate()
    .then(() => {
      console.log("Db and tables have been created...");
    })
    .catch(err => {
      console.log("Db connect error is: ", err);
    });
};
