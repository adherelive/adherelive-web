import AdhocJob from "../index";
import { EMAIL_TEMPLATE_NAME } from "../../../../constant";

export default class CrashJob extends AdhocJob {
  constructor(data) {
    super(data);
  }

  getEmailTemplate = () => {
    const { apiName } = this.getData();

    return {
      title: "Production Server Crash",
      toAddress: process.config.app.developer_email,
      templateName: EMAIL_TEMPLATE_NAME.SERVER_CRASH,
      templateData: {
        title: "AdhereLive Production Server Crash",
        mainBodyText: `Production Server seems to be down as ${apiName} is failing. Please fix the issue`,
        host: process.config.WEB_URL,
        contactTo: process.config.app.support_email,
      },
    };
  };
}
