import AdhocJob from "../index";
import { EMAIL_TEMPLATE_NAME } from "../../../../constant";

export default class CrashJob extends AdhocJob {
  constructor(data) {
    super(data);
  }

  getEmailTemplate = () => {
    const { apiName } = this.getData();

    return {
      title: "Production Server Issue",
      toAddress: process.config.app.developer_email,
      templateName: EMAIL_TEMPLATE_NAME.SERVER_CRASH,
      templateData: {
        title: "AdhereLive Production Server Issue",
        mainBodyText: `Production Server seems to be having an issue, as ${apiName} is failing. Please fix the issue`,
        host: process.config.WEB_URL,
        contactTo: process.config.app.support_email,
      },
    };
  };
}
