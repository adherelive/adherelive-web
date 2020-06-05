import apiWrapper from "../index";
import userService from "../../services/user/user.service";


export default class userWrapper extends apiWrapper {
    constructor(data) {
        super(data);
        this.userDetails = this.getData();
    }

    getId() {
        const {id} = this.userDetails || {};
        return id;
    }


    getDataStructure(data) {
        const {id, user_name, email, mobile_number, sign_in_type, category, activated_on} = this.userDetails || {};
        return {
            basic_info: {
                id,
                user_name,
                email,
                mobile_number
            },
            sign_in_type,
            category,
            activated_on
        }
    }

    getBasicInfo() {
        return {
            users: {
                [this.getId()]: this.getDataStructure()
            }
        }
    }

    async getBulkBasicInfo() {
        const allUsers = await userService.getAll();
    }
}