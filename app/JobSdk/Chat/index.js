export default class ChatJob {
  constructor(data) {
    this._data = data;
  }

  getData = () => {
    return this._data;
  };
}

export const MESSAGE_TYPE = {
  USER_MESSAGE: "USER_MESSAGE",
  BOT_MESSAGE: "BOT_MESSAGE"
};
