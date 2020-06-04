
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
}

export default new UserVerificationsService();