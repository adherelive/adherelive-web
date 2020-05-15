//import { database } from "../../../libs/mysql";
import Sequelize from "sequelize";

class UserService {
    constructor(){}

    async getUser(data){
	try{
	    const id=data._id;
	    const user = await database.query('SELECT * from users WHERE id=:userId', { replacements: { userId: id }, type: Sequelize.QueryTypes.SELECT });

	    return user;
	}
	catch(err){
	    console.log(err);
	    throw err;
	}
    }

}

module.exports = new UserService();
