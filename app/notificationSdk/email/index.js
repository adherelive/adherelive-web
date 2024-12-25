import EventExecutor from "../executor";

class EmailNotification {
  constructor() {}

  notify = (templates = []) => {
    for (const template of templates) {
      EventExecutor.sendEmail(template);
    }
  };
}

export default new EmailNotification();
