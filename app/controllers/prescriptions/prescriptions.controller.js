import Controller from "../index";
import { createLogger } from "../../../libs/logger";

import prescriptionsService from "../../../app/services/prescriptions/pdfService";

const logger = createLogger("WEB > PRESCRIPTIONS > CONTROLLER");

class PrescriptionsController extends Controller {
    constructor() {
        super();
    }

    generatePDF = async (req, res) => {
        const {raiseSuccess, raiseServerError} = this;
        try {
            const {user_id, permissions} = req.body;
            if (!user_id || !permissions) {
                return raiseSuccess(res, 400, {}, "Invalid Request");
            }

            await prescriptionsService.loadTranslations(user_id, permissions);
            return raiseSuccess(res, 200, {}, "Permissions updated successfully");
        } catch (error) {
            logger.error("Error updating permissions", error);
            return raiseServerError(res, error);
        }
    }

    getLatestUpdateDate(medications) {
        const medicationIds = Object.keys(medications);
        let date = null;
        let isPrescriptionUpdated = false;
        for (const medicationId of medicationIds) {
            const {
                [ medicationId ]: {
                    basic_info: {updated_at} = {},
                    details: mobileDetails = null,
                },
            } = medications;
            let newDate = new Date(updated_at);

            if (date == null) {
                date = newDate;
            } else if (newDate > date) {
                date = newDate;
                isPrescriptionUpdated = true;
            }
        }
        return {date, isPrescriptionUpdated};
    }
}

export default PrescriptionsController;