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
      // console.log("payload at connect", this.payload);
      this.client = this.stream.connect(this.key, this.secretKey);
      this.userToken = this.client.createUserToken(
        this.payload.actor.toString()
      );
      // console.log("Key1111: ", this.key, " Secret1111: ", this.secretKey);
      // console.log(
      //   "TESTTTTTTT11111: ",
      //   this.client,
      //   "USer token1111: ",
      //   this.userToken
      // );
      // console.log("token", this.userToken);
      return this;
    } catch (err) {
      console.log("err", err.message);
    }
  }

  getUserToken(userId) {
    try {
      this.client = this.stream.connect(this.key, this.secretKey);
      const userToken = this.client.createUserToken(userId);
      // console.log("Key2222: ", this.key, " Secret2222: ", this.secretKey);
      // console.log(
      //   "TESTTTTTTT222222: ",
      //   this.client,
      //   "USer token22222: ",
      //   userToken
      // );
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
      // console.log("notification payload=>>>>>>>>>>>>>>>>>", data);
      const feed = this.client.feed("notification", data.object);
      // console.log("Data....OBBBjeeeect: ", data.object);
      // console.log("FFFFFEeeeeeedddddd: ", feed);

      const response = await feed.addActivity(data);

      console.log("response", response);

      return result;
    } catch (err) {
      console.log("Error", err);
    }
  }

  async updateNotification() {
    try {
    } catch (err) {
      console.log(err);
    }
  }

  async deleteNotification() {
    try {
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = data => new Notifier(data);
