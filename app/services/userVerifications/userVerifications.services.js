
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
}

export default new UserVerificationsService();