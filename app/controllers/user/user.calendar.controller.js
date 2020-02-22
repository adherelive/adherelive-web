const cronofy = require("../../services/cronofy/cronofy.service");
const userService = require("../../services/user/user.service");
const Response = require("../../helper/responseFormat");
const Log = require("../../../libs/log")("calendarController");
const jwt = require("jsonwebtoken");
const errMessage = require("../../../config/messages.json").errMessages;
const constants = require("../../../config/constants");

class CalendarController {
  constructor() {}

  /** Calendar api test calls **/

  async listCalendar(req, res) {
    //IN RESPONSE BELOW TOKEN IS OF User's calendar field calendar access token
    try {
      const calendarList = await cronofy.readCalendars(
        "ADX91gHTWidCWhI3qmsGYM-V-B6wbbgW"
      );
      const response = new Response(true, 200);
      response.setData(calendarList);
      response.setMessage("List of Calendars.");

      return res.send(response.getResponse());
    } catch (err) {
      res.send({ error: 900, message: err });
    }
  }

  // async createCalendar(req, res) {
  //   // working
  //   try {
  //     let response = await cronofy.createCalendar(
  //       "pro_W@uFLPQIYQcs@QPq",
  //       "test calendar2",
  //       "asdwUu5RVykPkE_JYjJCIUahfJC760Rk"
  //     );
  //     res.send(response);
  //   } catch (err) {
  //     res.send({ error: 900, message: "error" });
  //   }
  // }

  async createEvent(req, res) {
    //working
    try {
      let response = await cronofy.createEvent(
        "cal_W@uFLPQIYQcs@QPq_2fVDHTouAOviDAjVcOq0gg",
        "event1",
        "Dummy event",
        "This is a dummy event",
        "2018-11-27T20:30:00Z",
        "2018-11-27T20:35:00Z",
        "asdwUu5RVykPkE_JYjJCIUahfJC760Rk"
      );
      if (response == 202) {
        res.send("Accepted");
      } else {
        res.send("Rejected");
      }
    } catch (err) {
      res.send({ error: 900, message: "error" });
    }
  }

  // async readEvent(req, res) {
  //   // working
  //   try {
  //     let response = await cronofy.readEvents(
  //       "Etc/UTC",
  //       "asdwUu5RVykPkE_JYjJCIUahfJC760Rk",
  //       "2018-10-25T19:20:00Z",
  //       "2018-12-30T19:20:00Z"
  //     );
  //     res.send(response);
  //   } catch (error) {
  //     res.send({ error: 900, message: "error" });
  //   }
  // }

  // async deleteEvent(req, res) {
  //   // working
  //   try {
  //     let response = await cronofy.deleteEvent(
  //       "cal_W@uFLPQIYQcs@QPq_JwYAdOT9kLC50jBEr4KJ7g",
  //       "event1",
  //       "asdwUu5RVykPkE_JYjJCIUahfJC760Rk"
  //     );
  //     if (response == 202) {
  //       res.send("Accepted");
  //     } else {
  //       res.send("Rejected");
  //     }
  //   } catch (err) {
  //     res.send({ error: 900, message: "error" });
  //   }
  // }

  // async freebusy(req, res) {
  //   // working
  //   try {
  //     let response = await cronofy.isUserAvailable(
  //       "2018-11-25T19:20:00Z",
  //       "2018-11-27T19:20:00Z",
  //       "Etc/UTC",
  //       "asdwUu5RVykPkE_JYjJCIUahfJC760Rk"
  //     );
  //     res.send(response);
  //   } catch (err) {
  //     res.send({ error: 900, message: "error" });
  //   }
  // }

  /** Calendar api test calls ends here **/
  /** Authorize api test calls **/

  async getAuthorizationForCalendar(req, res) {
    try {
      let state;
      if (req.userDetails.exists) {
        state = {
          userId: req.userDetails.userId,
          internalRedirectUri: req.query.redirecturi
        };
      } else {
        throw new Error(constants.COOKIES_NOT_SET);
      }

      let encodedState = await jwt.sign(state, process.config.TOKEN_SECRET_KEY);
      let response = await cronofy.requestAuthorization(
        "read_write", // user can read, create, update and delete events
        encodedState
      );
      res.redirect(response.payload.data.oauth_url);
    } catch (err) {
      Log.debug(err);

      let payload;

      switch (err.message) {
        case constants.COOKIES_NOT_SET:
          payload = {
            code: 401,
            error: errMessage.COOKIES_NOT_SET
          };
          break;

        default:
          payload = {
            code: 500,
            error: constants.INTERNAL_SERVER_ERROR
          };
          break;
      }

      let response = new Response(false, payload.code);
      response.setError(payload.error);
      return res.status(payload.code).json(response.getResponse());
    }
  }

  async getAccessTokenForCalendar(req, res) {
    try {
      const { code, state } = req.query;
      let response = await cronofy.requestAccessToken(code, state);
      let data = response.payload.data;

      await userService.updateUser(
        { _id: req.userDetails.userId },
        {
          calendar: {
            calendarAccessToken: data.access_token,
            calendarRefreshToken: data.refresh_token,
            scope: data.scope,
            accountId: data.accountId,
            providerName: data.linking_profile.provider_name,
            profileId: data.linking_profile.profile_id,
            profileName: data.linking_profile.profile_name
          }
        }
      );
      let userSettings = Object.assign(
        {},
        req.userDetails.userData.settings,
        (req.userDetails.userData.settings.isCalendarSynced = true)
      );
      await userService.updateUser(
        // reflecting syncing in user profile
        { _id: req.userDetails.userId },
        {
          settings: userSettings
        }
      );
      res.redirect(process.config.WEB_URL + req.internalRedirectUri);
    } catch (err) {
      Log.debug(err);
      let response = new Response(false, 500);
      response.setError({
        error: errMessage.INTERNAL_SERVER_ERROR
      });
      res.status(500).json(response.getResponse());
    }
  }

  async getRefreshedAccessToken(req, res) {
    try {
      let refreshToken;

      if (req.userDetails.exists) {
        refreshToken = req.userDetails.userData.calendar.calendarRefreshToken;
      } else {
        throw new Error(constants.COOKIES_NOT_SET);
      }

      let response = await cronofy.refreshAccessToken(refreshToken);
      let data = response.payload.data;
      await userService.updateUser(
        { _id: user._id },
        { "calendar.calendarAccessToken": data.access_token }
      );
      return res.send(response); // It will not send any response
    } catch (err) {
      Log.debug(err);

      let payload;

      switch (err.message) {
        case constants.COOKIES_NOT_SET:
          payload = {
            code: 401,
            error: errMessage.COOKIES_NOT_SET
          };
          break;

        default:
          payload = {
            code: 500,
            error: errMessage.INTERNAL_SERVER_ERROR
          };
          break;
      }

      let response = new Response(false, payload.code);
      response.setError(payload.error);
      return res.status(payload.code).json(response.getResponse());
    }
  }

  async getCalendarDetails(req, res) {
    try {
      const userId = req.params.userId;
      let data = {};
      const calendarDetails = await cronofy.getCalendarDetailsById(userId);
      if (!calendarDetails) {
      } else {
        let resposne = new Response(true, 200);
        resposne.setData({ calendarDetails });
        response.setMessage("Calendar Details Fetched");
      }
    } catch (err) {
      let response = new Response(false, 500);
      response.setError(errMessage.INTERNAL_SERVER_ERROR);
      return res.status(500).json(response.getResponse());
    }
  }

  /** Authorize api test calls ends here **/
}

module.exports = new CalendarController();
