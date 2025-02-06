// const AWS = require("aws-sdk");
// const Log = require("../../../libs/log")("communications --> emailManger");
import { createLogger } from "../../../libs/logger";

const path = require("path");
const { existsSync } = require("fs");
const ejs = require("ejs");
const emailPayloadBuilder = require("./emailPayloadBuilder");

const logger = createLogger("communications --> emailManger");

const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer-sendgrid-transport");

class EmailManger {
  constructor() {
    /**
     * TODO: Why is this commented out?
    AWS.config.update({
      accessKeyId: process.config.aws.access_key_id,
      secretAccessKey: process.config.aws.access_key,
      region: process.config.aws.region
    });

    this.ses = new AWS.SES({
      apiVersion: "2010-12-01"
    });
     */

    this.smtpTransporter = nodemailer.createTransport(
      smtpTransport({
        auth: {
          // api_user:process.config.email.USER,
          api_key: process.config.email.KEY,
          // api_user: 'adherelive-demo',
          // api_key: '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'
        },
      })
    );
  }

  genrateEmailTemplateString(name, data, options) {
    let filepath = path.join(__dirname, "/../../views/emailTemplates/");
    return new Promise((resolve, reject) => {
      ejs.renderFile(filepath + name + ".ejs", data, options, (err, str) => {
        if (err) {
          return reject(err);
        }
        return resolve(str);
      });
    });
  }

  emailPayloadValidator(emailPayload) {
    if (!emailPayload.toAddress)
      return {
        error: 1,
        message: "Undefined or invalid EMail To address",
      };

    if (!emailPayload.title)
      return {
        error: 1,
        message: "Undefined or invalid Email title",
      };

    if (!emailPayload.templateName)
      return {
        error: 1,
        message: "Invalid  or undefined Email template name",
      };

    if (!emailPayload.templateData)
      return {
        error: 1,
        message: "Invalid or undefined Email template data",
      };

    return {
      error: 0,
      message: "Valid Email payload",
    };
  }

  async emailPayloadTransformer(payload) {
    try {
      let payloadBuilder = new emailPayloadBuilder(payload);
      let templateString = "";
      switch (payload.templateName) {
        case "general":
          templateString = await this.genrateEmailTemplateString(
            "general",
            payload.templateData,
            {}
          );
          break;
        case "welcome":
          templateString = await this.genrateEmailTemplateString(
            "welcome",
            payload.templateData,
            {}
          );
          break;
        case "invitation":
          templateString = await this.genrateEmailTemplateString(
            "invitation",
            payload.templateData,
            {}
          );
          break;
        case "verifiedDoctor":
          templateString = await this.genrateEmailTemplateString(
            "verifiedDoctor",
            payload.templateData,
            {}
          );
          break;
        case "otpVerification":
          templateString = await this.genrateEmailTemplateString(
            "otpVerification",
            payload.templateData,
            {}
          );
          break;
        case "serverCrash":
          templateString = await this.genrateEmailTemplateString(
            "serverCrash",
            payload.templateData,
            {}
          );
          break;
        case "BookingStatusSubmittedUser":
          templateString = await this.genrateEmailTemplateString(
            "general",
            payload.templateData,
            {}
          );
          break;
        case "BookingRequestSubmittedManger":
          templateString = await this.genrateEmailTemplateString(
            "general",
            payload.templateData,
            {}
          );
          break;
        case "BookingStatusApprovedUser":
          templateString = await this.genrateEmailTemplateString(
            "general",
            payload.templateData,
            {}
          );
          break;
        case "BookingStatusApprovedManger":
          templateString = await this.genrateEmailTemplateString(
            "general",
            payload.templateData,
            {}
          );
          break;
        case "BookingStatusRejectedUser":
          templateString = await this.genrateEmailTemplateString(
            "general",
            payload.templateData,
            {}
          );
          break;
        case "BookingStatusRejectedManger":
          templateString = await this.genrateEmailTemplateString(
            "general",
            payload.templateData,
            {}
          );
          break;
        case "BookingStatusCompletedUser":
          templateString = await this.genrateEmailTemplateString(
            "general",
            payload.templateData,
            {}
          );
          break;
        case "BookingStatusCompletedProvider":
          templateString = await this.genrateEmailTemplateString(
            "general",
            payload.templateData,
            {}
          );
          break;
        case "forgotPassword":
          templateString = await this.genrateEmailTemplateString(
            "forgotPassword",
            payload.templateData,
            {}
          );
          break;
        case "invite":
          templateString = await this.genrateEmailTemplateString(
            "invite",
            payload.templateData,
            {}
          );
          break;
        case "appointment":
          templateString = await this.genrateEmailTemplateString(
            "appointment",
            payload.templateData,
            {}
          );
          break;
        case "reminder":
          templateString = await this.genrateEmailTemplateString(
            "reminder",
            payload.templateData,
            {}
          );
          break;
        case "surveyInvite":
          templateString = await this.genrateEmailTemplateString(
            "surveyInvite",
            payload.templateData,
            {}
          );
          break;
        case "article":
          templateString = await this.genrateEmailTemplateString(
            "article",
            payload.templateData,
            {}
          );
          break;

        case "medicationReminder":
          templateString = await this.genrateEmailTemplateString(
            "medicationReminder",
            payload.templateData,
            {}
          );
          break;

        case "benefitPlan":
          templateString = await this.genrateEmailTemplateString(
            "benefitPlan",
            payload.templateData,
            {}
          );
          break;
        case "benefitReport":
          templateString = await this.genrateEmailTemplateString(
            "benefitReport",
            payload.templateData,
            {}
          );
          break;
        case "programReport":
          templateString = await this.genrateEmailTemplateString(
            "programReport",
            payload.templateData,
            {}
          );
          break;
        case "emailVerification": {
          templateString = await this.genrateEmailTemplateString(
            "emailVerification",
            payload.templateData,
            {}
          );
          break;
        }
        default:
          return {
            error: 1,
            message: "Invalid Email template name!",
          };
      }

      let content = payloadBuilder
        .createToAddress()
        .createCcAddress()
        .createEmailBodyTemplate()
        .createEmailTitle()
        .createEmailBodyTemplate(templateString)
        .createSourceAddress(process.config.email.FROM)
        .createSourceName(process.config.email.FROM_NAME)
        .createReplyToAddress(process.config.email.FROM)
        .build();

      return content;
    } catch (err) {}
  }

  async sendEmail(emailPayload) {
    try {
      let payload = await this.emailPayloadTransformer(emailPayload);
      logger.debug(
        "Validating email payload!! ---> ",
        process.config.SMTP_USER,
        process.config.SMTP_KEY
      );
      let isValid = this.emailPayloadValidator(emailPayload);
      if (isValid && isValid.error == 1) return isValid;
      logger.info("Email payload is valid in Email Manager!");
      logger.debug("Transforming EMail payload to AWS payload!!");

      if (payload.error && payload.error == 1) return payload;

      logger.info("Email payload transformed successfully!");
      logger.info("Sending email...");
      /**
       * TODO: Check why it is commented and remove or reinstate
      let publishResponse = this.ses
        .sendEmail(payload, (err, data) => {
          if (err) {
            logger.error("Sending an Email error!!", err);
          }
          if (data) {
            logger.info("Email sent successfully!!", data);
          }
        })
        .promise();
      delete payload.Message;
      delete payload.Destination;
      delete payload.ReplyToAddresses;
       */
      const publishResponse = await this.smtpTransporter.sendMail(payload);

      return publishResponse;
    } catch (err) {
      logger.error("sending mail error!", err);
    }
  }
}

module.exports = new EmailManger();
