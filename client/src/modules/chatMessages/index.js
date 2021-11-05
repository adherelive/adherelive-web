import { REQUEST_TYPE } from "../../constant";
import { doRequest } from "../../Helper/network";
import { fetchRaiseChatNotificationUrl } from "../../Helper/urls/notifications";

const ADD_MESSAGE_FOR_CHAT_COMPLETED = "ADD_MESSAGE_FOR_CHAT_COMPLETED";

const CHANNEL = "channel";
const intialState = {};

const addMessagesForChat = (state, data) => {
  const { room_id = "", messages } = data;
  let { messages: messagesOfRoom = [], messageIds = [] } = state[room_id] || {};
  // console.log('3628947832974892348932', room_id, typeof (messages), Object.keys(messages), Object.keys(messages).includes(CHANNEL), messagesOfRoom, messageIds, state);
  if (Object.keys(messages).includes(CHANNEL)) {
    // console.log('3628947832974892348932', room_id, typeof (messages), Object.keys(messages), messagesOfRoom, messageIds, state);
    let mId = parseInt(messages.state.index);
    let add = messageIds.includes(mId) ? false : true;

    // console.log('3628947832974892348932  canAdd', add, mId, messageIds.includes(mId));
    if (add) {
      messagesOfRoom.push(messages);
      messageIds.push(mId);
    }
  } else {
    for (let message of messages) {
      let mId = parseInt(message.state.index);
      let add = messageIds.includes(mId) ? false : true;

      // console.log('3628947832974892348932  canAdd', add, mId, messageIds.includes(mId));
      if (add) {
        messagesOfRoom.push(message);
        messageIds.push(mId);
      }
    }
  }
  state[room_id] = { messages: messagesOfRoom, messageIds };
  // console.log('3628947832974892348932  last', messagesOfRoom, messageIds, state);
  return { ...state };
};

export const raiseChatNotification = (payload) => {
  let response = {};
  return async (dispatch) => {
    try {
      response = await doRequest({
        method: REQUEST_TYPE.POST,
        url: fetchRaiseChatNotificationUrl(),
        data: payload,
      });

      const { status, payload: { error = "", data = {} } = {} } =
        response || {};
    } catch (err) {
      return { status: false };
    }
    return response;
  };
};

export const addMessageOfChat = (room_id, messages) => {
  return async (dispatch) => {
    try {
      dispatch({
        type: ADD_MESSAGE_FOR_CHAT_COMPLETED,
        payload: { room_id, messages },
      });
    } catch (error) {}
  };
};

export default (state = intialState, action) => {
  const { type, payload = {} } = action;
  switch (type) {
    case ADD_MESSAGE_FOR_CHAT_COMPLETED: {
      return addMessagesForChat(state, payload);
    }
    default: {
      return state;
    }
  }
};
