const { getDataforNotification } = require("./notification.controller.helper");
const Response = require("../../helper/responseFormat");
const Log = require("../../../libs/log")("NotificationController");

class NotificationController {
  constructor() {}

  async fetchNotification(req, res) {
    try {
      const { activities } = req.body;
      const { userId } = req.userDetails;
      let events = {};
      let users = {};
      let surveys = {};
      let articles = {};
      let notifications = {};
      let products = {};
      let medicationReminderIds = [];
      let benefitPlan = {};
      let dispensation = {};
      let contributionRequests = {};
      let charity = {};
      let notification_ids = [];
      for (let key in activities) {
        console.log("activities--------------->", activities[key]);

        const { activity: activitydata, is_read } = activities[key];
        const { id } = activitydata[0] || {};
        notification_ids.push(id);
        const details = await getDataforNotification({
          data: activitydata[0] || {},
          loggedInUser: userId,
          is_read: is_read
        });
        const {
          notification_data = {},
          users: activityUser = {},
          events: activityEvents = {},
          surveys: activitySurvey = {},
          articles: activityArticle = {},
          products: activityProduct = {},
          medicationReminderIds: activityMedicationReminderIds = [],
          benefitPlan: activityBenefitPlan = {},
          dispensation: activityDispensation = {},
          charity: activityCharity = {},
          contributionRequests: activityContributionRequest = {}
        } = details || {};
        console.log("details----------- :", details);
        events = Object.assign(events, activityEvents);
        users = Object.assign(users, activityUser);
        surveys = Object.assign(surveys, activitySurvey);
        articles = Object.assign(articles, activityArticle);
        notifications = Object.assign(notifications, notification_data);
        products = Object.assign(products, activityProduct);
        medicationReminderIds = [
          ...medicationReminderIds,
          ...activityMedicationReminderIds
        ];
        benefitPlan = Object.assign(benefitPlan, activityBenefitPlan);
        dispensation = Object.assign(dispensation, activityDispensation);
        charity = Object.assign(charity, activityCharity);
        contributionRequests = Object.assign(
          contributionRequests,
          activityContributionRequest
        );
      }
      let response = new Response(true, 200);
      response.setData({
        users,
        events,
        notifications,
        surveys,
        articles,
        notification_ids,
        products,
        medicationReminderIds,
        benefitPlan,
        dispensation,
        charity,
        contributionRequests
      });
      response.setMessage("Your notifications are ready.");
      res.send(response.getResponse());
    } catch (err) {
      console.log("err===========================>", err);
      Log.debug(err);
      let payload = {
        error: "something went wrong!",
        code: 500
      };
      let response = new Response(false, payload.code);
      response.setError(payload.error);
      return res.status(payload.code).json(response.getResponse());
    }
  }
}

module.exports = new NotificationController();
