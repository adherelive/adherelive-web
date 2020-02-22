const axios = require("axios");
const Response = require("../../helper/responseFormat");
const apiUrl = process.config.calendar.CRONOFY_API_URL;
const oAuthAppUrl = process.config.calendar.CRONOFY_OAUTH_APP_URL;
const oAuthApiUrl = process.config.calendar.CRONOFY_OAUTH_API_URL;
const clientId = process.config.calendar.CRONOFY_CLIENT_ID;
const clientSecret = process.config.calendar.CRONOFY_CLIENT_SECRET;
const appUrl = process.config.APP_URL;
const redirectURI = appUrl + "/api/auth-token"; //dummy

class CronofyService {
  getHeaders(accessToken) {
    return {
      "Content-Type": "application/json",
      Authorization: "Bearer " + accessToken
    };
  }
  getHeadersContentOnly() {
    return {
      "Content-Type": "application/json"
    };
  }

  async readCalendars(accessToken) {
    try {
      const calendarList = await axios.get(apiUrl + "/calendars", {
        headers: this.getHeaders(accessToken)
      });
      // .then(response => {
      //   result = response.data;
      // });
      return calendarList.data;
    } catch (err) {
      //Log.debug(err);
      const response = new Response(false, 500);
      response.setError({
        status: "INTERNAL_SERVER_ERROR",
        message: String(err)
      });
      return response.getResponse();
    }
  }

  async createCalendar(profileId, name, accessToken) {
    try {
      let config = {
        headers: this.getHeaders(accessToken)
      };
      let res = await axios.post(
        apiUrl + "/calendars",
        {
          profile_id: profileId,
          name: name
        },
        config
      );
      let response = new Response(true, 200);
      response.setData(res.data);
      response.setMessage("Calendar created.");
      return response.getResponse();
    } catch (err) {
      let response = new Response(false, 500);
      response.setError({
        status: "INTERNAL_SERVER_ERROR",
        message: String(err)
      });
      return response.getResponse();
    }
  }

  async readEvents(tzid, accessToken, fromDate, toDate) {
    try {
      let res;
      if (fromDate != undefined) {
        res = await axios.get(apiUrl + "/events", {
          headers: this.getHeaders(accessToken),
          params: { from: fromDate, to: toDate, tzid: tzid }
        });
      } else {
        res = await axios.get(apiUrl + "/events", {
          headers: this.getHeaders(accessToken),
          params: { tzid: tzid }
        });
      }

      let response = new Response(true, 200);
      response.setData(res.data);
      response.setMessage("List of Events.");
      return response.getResponse();
    } catch (err) {
      let response = new Response(false, 500);
      response.setError({
        status: "INTERNAL_SERVER_ERROR",
        message: String(err)
      });
      return response.getResponse();
    }
  }

  async createEvent(
    calendarID,
    eventId,
    summary,
    description,
    start,
    end,
    accessToken
  ) {
    try {
      let config = {
        headers: this.getHeaders(accessToken)
      };
      let res = await axios.post(
        apiUrl + "/calendars/" + calendarID + "/events",
        {
          event_id: eventId,
          summary: summary,
          description: description,
          start: start,
          end: end
        },
        config
      );
      return res.config.data;
    } catch (err) {
      let response = new Response(false, 500);
      response.setError({
        status: "INTERNAL_SERVER_ERROR",
        message: String(err)
      });
      return response.getResponse();
    }
  }

  async deleteEvent(calendarID, eventId, accessToken) {
    try {
      let config = {
        headers: this.getHeaders(accessToken),
        data: { event_id: eventId }
      };
      //
      let res = await axios.delete(
        apiUrl + "/calendars/" + calendarID + "/events",
        config
      );
      return res.config.data;
    } catch (err) {
      let response = new Response(false, 500);
      response.setError({
        status: "INTERNAL_SERVER_ERROR",
        message: String(err)
      });
      return response.getResponse();
    }
  }

  async isUserAvailable(fromDate, toDate, tzid, accessToken) {
    try {
      let res = await axios.get(apiUrl + "/free_busy", {
        headers: this.getHeaders(accessToken),
        params: { from: fromDate, to: toDate, tzid: tzid }
      });
      let response = new Response(true, 200);
      response.setData(res.data);
      response.setMessage("Freebusy status of the user.");
      return response.getResponse();
    } catch (err) {
      let response = new Response(false, 500);
      response.setError({
        status: "INTERNAL_SERVER_ERROR",
        message: String(err)
      });
      return response.getResponse();
    }
  }

  async requestAuthorization(scope, state) {
    try {
      let resp = await axios.get(oAuthAppUrl, {
        params: {
          response_type: "code",
          client_id: clientId,
          redirect_uri: redirectURI,
          scope: scope,
          state: state
        }
      });
      let response = new Response(true, 200);
      response.setData(
        "oauth_url",
        resp.request.res.client._httpMessage._redirectable._currentUrl
      );
      response.setMessage("Successfully authorized.");
      return response.getResponse();
    } catch (err) {
      Log.debug(err);
      let response = new Response(false, 500);
      response.setError({
        status: "INTERNAL_SERVER_ERROR",
        message: String(err)
      });
      return response.getResponse();
    }
  }

  async requestAccessToken(oAuthCode, state) {
    try {
      let config = {
        headers: this.getHeadersContentOnly()
      };
      let res = await axios.post(
        oAuthApiUrl,
        {
          client_id: clientId,
          client_secret: clientSecret,
          grant_type: "authorization_code",
          code: oAuthCode,
          redirect_uri: redirectURI
        },
        config
      );

      let response = new Response(true, 200);
      response.setData(res.data);
      response.setMessage("Access Token request successful.");
      return response.getResponse();
    } catch (err) {
      Log.debug(err);
      let response = new Response(false, 500);
      response.setError({
        status: "INTERNAL_SERVER_ERROR",
        message: String(err)
      });
      return response.getResponse();
    }
  }

  async refreshAccessToken(refreshToken) {
    try {
      let config = {
        headers: this.getHeadersContentOnly()
      };
      let res = await axios.post(
        oAuthApiUrl,
        {
          client_id: clientId,
          client_secret: clientSecret,
          grant_type: "refresh_token",
          refresh_token: refreshToken
        },
        config
      );
      let response = new Response(true, 200);
      response.setData(res.data);
      response.setMessage("Refresh Access Token request successful");
      return response.getResponse();
    } catch (err) {
      Log.debug(err);
      let response = new Response(false, 500);
      response.setError({
        status: "INTERNAL_SERVER_ERROR",
        message: String(err)
      });
      return response.getResponse();
    }
  }

  async getCalendarDetailsById(userId) {
    try {
      let calendarData = await userModel.findById(userId);

      return calendarData;
    } catch (err) {
      throw err;
    }
  }
}
module.exports = new CronofyService();
