class EmailPayloadBuilder {
  constructor(data) {
    this.emailData = data;
    this.payload = {};
    this.payload.Destination = {};
    this.payload.Message = {};
    this.payload.Message.Body = {};
  }

  /**
   * This function checks if toAddress field is string or array.
   * If it is an array, it just copies the array.
   * If it is a string, it puts the string in the array and then copies it.
   */

  createToAddress() {
    if (typeof this.emailData.toAddress == "string") {
      this.payload.Destination = {};
      this.payload.to = this.emailData.toAddress;
    } else {
      this.payload.to = this.emailData.toAddress;
    }
    return this;
  }

  /**
   * This function checks if ccAddress field exists or not,
   * then if it exists it checks wheter it is a string or an array.
   * If it is an array, it just copies the array.
   * If it is a string, it puts the string in the array and then copies it.
   */

  createCcAddress() {
    if (
      this.emailData.ccAddress == "" ||
      this.emailData.ccAddress == undefined ||
      this.emailData.ccAddress == null
    )
      return this;

    if (typeof this.emailData.ccAddress == "string") {
      this.payload.Destination.CcAddresses = [this.emailData.ccAddress];
    } else {
      this.payload.Destination.CcAddresses = this.emailData.ccAddress;
    }
    return this;
  }

  createEmailBodyTemplate(templateString = "") {
    if (templateString == "") return this;
    this.payload.html = templateString;
    return this;
  }

  createEmailBodyText() {
    if (text == "") return this;
    this.payload.Message.Body.Text = {
      Charset: "UTF-8",
      Data: text
    };

    return this;
  }

  createEmailTitle() {
    this.payload.subject = this.emailData.title;

    return this;
  }

  createSourceAddress(sourceAddress) {
    this.payload.from = sourceAddress;
    return this;
  }

  createReplyToAddress(replyToAddress = "") {
    if (replyToAddress == "") return this;
    if (typeof replyToAddress == "string") {
      this.payload.ReplyToAddresses = [replyToAddress];
    } else {
      this.payload.ReplyToAddresses = replyToAddress;
    }
    return this;
  }

  build() {
    return this.payload;
  }
}

module.exports = EmailPayloadBuilder;
