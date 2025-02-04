let stream = require("getstream");

class Notifier {
  constructor(payload) {
    this.key = process.config.getstream.API_KEY;
    this.secretKey = process.config.getstream.API_SECRET;
    this.payload = payload;
    this.stream = stream;
  }

  connect() {
    try {
      this.client = this.stream.connect(this.key, this.secretKey);
      this.userToken = this.client.createUserToken(
        this.payload.actor.toString()
      );

      return this;
    } catch (err) {
      logger.debug("err", err.message);
    }
  }

  getUserToken(userId) {
    try {
      this.client = this.stream.connect(this.key, this.secretKey);
      const userToken = this.client.createUserToken(userId);

      return userToken;
    } catch (err) {
      throw err;
    }
  }

  async sendNotification() {
    try {
      let data =
        arguments && arguments[0]
          ? arguments[0]
          : Object.assign({}, this.payload);

      let result = {};
      const feed = this.client.feed("notification", data.object);
      const response = await feed.addActivity(data);
      logger.debug("response", response);
      return result;
    } catch (err) {
      logger.debug("Error", err);
    }
  }

  async updateNotification() {
    try {
    } catch (err) {
      logger.debug(err);
    }
  }

  async deleteNotification() {
    try {
    } catch (err) {
      logger.debug(err);
    }
  }
}

module.exports = (data) => new Notifier(data);
