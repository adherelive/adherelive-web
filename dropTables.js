// FOR TEST...
const Config = require("./config/config");
Config();

const rollback = import("./libs/mysql").then(module => {
    module.default.query('SET FOREIGN_KEY_CHECKS = 0')
        .then(function(){
            return module.default.sync({ force: true });
        })
        .then(function(){
            return module.default.query('SET FOREIGN_KEY_CHECKS = 1')
        })
        .then(function(){
            console.log('Database synchronised.');
        }, function(err){
            console.log(err);
        });
}).catch(err => {
    console.log("db rollback error : ", err);
});
// import database from "./libs/mysql";
//
// export default {};