import { MESSAGE_TYPES } from "../../../constant";
import UserMessageJob from "./userMessageJob";
import BotMessageJob from "./botMessageJob";

class ChatObserver {
  constructor() {}

  execute = (typeStatus, details) => {
    switch (typeStatus) {
      case MESSAGE_TYPES.USER_MESSAGE:
        return new UserMessageJob(details);
      case MESSAGE_TYPES.BOT_MESSAGE:
        return new BotMessageJob(details);
    }
  };
}

export default new ChatObserver();
