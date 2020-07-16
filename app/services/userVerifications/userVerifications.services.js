
import UserVerifications from "../../models/userVerifications";

class UserVerificationsService {
    async addRequest(data) {
        try {
            const response = await UserVerifications.create(data);
            return response;
        } catch (err) {
            throw err;
        }
    }

    async getRequestByLink(link) {
        try {
            const verification = await UserVerifications.findOne({
                where: {
                    request_id:link
                }
            });
            return verification;
        } catch (err) {
            throw err;
        }
    }

    updateVerification = async (data, link) => {
        try {
            const verification = await UserVerifications.update(data, {
                where: {
                    request_id:link
                }
            });
            return verification;
        } catch (error) {
            throw error;
        }
    };

    getRequestByData = async (data) => {
        try {
            const verification = await UserVerifications.findOne({
                where: data
            });
            return verification;
        } catch (err) {
            throw err;
        }
    }
}

export default new UserVerificationsService();