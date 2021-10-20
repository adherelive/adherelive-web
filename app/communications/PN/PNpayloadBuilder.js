class PNpayloadBuilder {
  constructor(payload) {
    this.inputPayload = payload;
    this.smsPayload = {};
    if (this.inputPayload.type == "ios") this.buildAPNS();
    if (this.inputPayload.type == "android") this.buildGCM();
  }

  buildGCM() {
    this.smsPayload.GCM = {};
    let content = {
      data: this.inputPayload.data,
      notification: this.inputPayload.notification
    };
    this.smsPayload.GCM = JSON.stringify(content);
  }

  buildAPNS() {
    this.smsPayload.APNS = {};
    let content = {
      aps: {
        alert: this.inputPayload.alert,
        sound: this.inputPayload.sound || "default",
        badge: this.inputPayload.badge || 1
      }
    };
    this.smsPayload.APNS = JSON.stringify(content);
  }

  getPayload() {
    return this.smsPayload;
  }
}

module.exports = PNpayloadBuilder;
