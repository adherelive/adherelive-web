import AuthJob from "../";
import {EMAIL_TEMPLATE_NAME} from "../../../../constant";

class PatientOtpJob extends AuthJob {
    constructor(data) {
        super(data);
    }

    getEmailTemplate = () => {
        const {getData} = this;
        const {details: {otp} = {}} = getData() || {};

        const templateData = [
            {
                title: "OTP Verification for patient",
                toAddress: process.config.app.developer_email,
                templateName: EMAIL_TEMPLATE_NAME.OTP_VERIFICATION,
                templateData: {
                    title: "Patient",
                    mainBodyText: "OTP for adhere patient login is",
                    subBodyText: otp,
                    host: process.config.WEB_URL,
                    contactTo: process.config.app.support_email
                }
            }
        ];

        return templateData;
    };

    getSmsTemplate = () => {
        const {getData} = this;
        const {details: {prefix, phoneNumber, otp} = {}} = getData() || {};

        const templateData = [
            {
                phoneNumber: `+${prefix}${phoneNumber}`,
                message:`Hello from Adhere! Your One Time Password is ${otp}`
            }
        ];

        return templateData;
    };
}

export default PatientOtpJob;