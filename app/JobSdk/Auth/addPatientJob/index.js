import AuthJob from "../";
import {EMAIL_TEMPLATE_NAME} from "../../../../constant";

class AddPatientJob extends AuthJob {
    constructor(data) {
        super(data);
    }

    getEmailTemplate = () => {
        const {getData} = this;
        const {details: {universalLink} = {}} = getData() || {};

        const templateData = [
            {
                title: "AdhereLive: Mobile Patient Verification mail",
                toAddress: process.config.app.developer_email,
                templateName: EMAIL_TEMPLATE_NAME.INVITATION,
                templateData: {
                    title: "Patient",
                    link: universalLink,
                    inviteCard: "",
                    mainBodyText: "We are happy to welcome you onboard the AdhereLive platform",
                    subBodyText: "Please verify your account",
                    buttonText: "Verify",
                    host: process.config.WEB_URL,
                    contactTo: process.config.app.support_email
                }
            }
        ];

        return templateData;
    };

    getSmsTemplate = () => {
        const {getData} = this;
        const {details: {prefix, phoneNumber, universalLink} = {}} = getData() || {};

        const templateData = [
            {
                phoneNumber: `+${prefix}${phoneNumber}`,
                message: `Hello from AdhereLive! Please click the link to verify your number. ${universalLink}`
            }
        ];

        return templateData;
    };
}

export default AddPatientJob;
