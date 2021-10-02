import {Op} from "sequelize";
import moment from "moment";
import Database from "../../../libs/mysql";
import {TABLE_NAME} from "../../models/otpVerifications";

class OtpVerificationService {
    create = async (data) => {
        try {
            const otpDetails = await Database.getModel(TABLE_NAME).create(data);
            return otpDetails;
        } catch (error) {
            throw error;
        }
    };

    getOtpByData = async (data) => {
        try {
            const {otp, user_id} = data; //otp,
            const otpDetails = await Database.getModel(TABLE_NAME).findAll({
                limit: 1,
                where: {
                    // TODO: change on deployment
                    ...data,
                    updated_at: {
                        [Op.gte]: moment().subtract(process.config.app.otp_live_minutes, 'minutes').toDate()
                    }
                },
            });
            return otpDetails;
        } catch (error) {
            throw error;
        }
    };

    delete = async (data) => {
        try {
            const {otp, user_id} = data;
            const otpDetails = await Database.getModel(TABLE_NAME).destroy({
                where: {
                    user_id,
                },
            });
            return otpDetails;
        } catch (error) {
            throw error;
        }
    };
}

export default new OtpVerificationService();
