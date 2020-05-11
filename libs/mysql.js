import { Sequelize } from "sequelize";

export const database = new Sequelize("adhere", "user", "password", {
  host: "mysql",
  dialect: "mysql"
});

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
