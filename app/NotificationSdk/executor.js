class EventExecutor {
    async sendMail(mailData, scheduledJobId) {
        try {
            let isValid = await validateMailData(mailData);
            let response = await EmailManager.sendEmail(mailData);
            Object.assign(
                mailData,
                response ? { status: "SENT" } : { status: "FAILED" }
            );
            let logger = new Logger("email", mailData);
            logger.log();
            // if (scheduledJobId && response) {
            //   let updatedJob = await Scheduler.updateScheduledJob(scheduledJobId, {
            //     status: "completed"
            //   });
            // }
        } catch (err) {
            NotificationSdk.execute(EVENTS.EMAIL_ERROR, err, "mail_error");
        }
    }

    async sendSms(smsData, scheduledJobId) {
        try {
            let response = SmsManager.sendSms(smsData);
            Object.assign(
                smsData,
                response ? { status: "SENT" } : { status: "FAILED" }
            );
            let logger = new Logger("sms", smsData);
            logger.log();
            // if (scheduledJobId && response) {
            //   let updatedJob = await Scheduler.updateScheduledJob(scheduledJobId, {
            //     status: "completed"
            //   });
            // }
        } catch (err) {
            NotificationSdk.execute(EVENTS.SMS_ERROR, err);
        }
    }
}

export default new EventExecutor();