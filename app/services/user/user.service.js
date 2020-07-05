import userModel from "../../models/users";

class UserService {
    constructor() {
    }

    async getAll() {
        try {
            const user = await userModel.findAll();
            return user;
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    getUser = async (id) => {
        try {
            const user = await userModel.findOne({
                where: {
                    id
                }
            });
            return user;
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    async getUserByEmail(data) {
        try {
            const {email} = data;
            const user = await userModel.findOne({
                where: {
                    email
                }
            });
            return user;
        } catch (error) {
            throw error;
        }
    }

    getUserById = async id => {
        try {
            const user = await userModel.findOne({
                where: {
                    id
                }
            });
            return user;
        } catch (err) {
            throw err;
        }
    };

    getUserByData = async data => {
        try {
            const user = await userModel.findAll({
                where: data
            });
            return user;
        } catch (err) {
            throw err;
        }
    };

    async addUser(data) {
        try {
            const response = await userModel.create(data);
            return response;
        } catch (err) {
            throw err;
        }
    }

    updateEmail = async (email, id) => {
        try {
            const user = await userModel.update({
               email,
            }, {
                where: {
                    id
                }
            });
            return user;
        } catch (error) {
            throw error;
        }
    };

    updateUser = async (data, id) => {
        try {
            const user = await userModel.update(data, {
                where: {
                    id
                }
            });
            return user;
        } catch (error) {
            throw error;
        }
    };

}

export default new UserService();
