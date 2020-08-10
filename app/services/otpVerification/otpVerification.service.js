import OtpVerification from "../../models/otpVerifications";
import {Op} from "sequelize";
import moment from "moment";

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
            const {user_id} = data;
            console.log("moment now ---> ", moment().toDate());
            const otpDetails = await OtpVerification.destroy({
                where: {
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
}

export default new OtpVerificationService();
