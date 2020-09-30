import {Op} from "sequelize";
import moment from "moment";
import database from "../../../libs/mysql";

const {otp_verifications: OtpVerification} = database.models;

class OtpVerificationService {

    create = async (data) => {
        try {
            const otpDetails = await OtpVerification.create(data);
            return otpDetails;
        } catch(error) {
            throw error;
        }
    };

    getOtpByData = async (data) => {
        try {
            const {otp, user_id} = data;
            console.log("moment now ---> ", moment().toDate());
            const otpDetails = await OtpVerification.findAll({
                limit: 1,
                where: {
                    // TODO: change on deployment
                    otp,
                    user_id,
                    updated_at: {
                        [Op.gte]: moment().subtract(2, 'minutes').toDate()
                    }
                },
            });
            return otpDetails;
        } catch(error) {
            throw error;
        }
    };

    delete = async (data) => {
        try {
            const {otp, user_id} = data;
            console.log("moment now ---> ", moment().toDate());
            const otpDetails = await OtpVerification.destroy({
                where: {
                    user_id,
                },
            });
            return otpDetails;
        } catch(error) {
            throw error;
        }
    };
}

export default new OtpVerificationService();
