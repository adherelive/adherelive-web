import createLink from "../../../app/branch-io";
import { EVENT_TYPE } from "../../../constant";
import { VERIFICATION_TYPE } from "../../../constant";

//const temp_app_link = "http://localhost:3000";
const temp_app_link = process.config.APP_URL;

export default async (payload = {}) => {
  let universalLink;
  try {
    const { event_type } = payload;

    const { link } = payload;
    const data = {
      $desktop_url: `${temp_app_link}/verify/${link}`,
      data: { type: EVENT_TYPE.INVITATION, link }
    };
    // console.log("=======================", event_type, payload);
    // switch (event_type) {
    //     case EVENT_TYPE.APPOINTMENT: {
    //         break;
    //     }
    //     case EVENT_TYPE.MEDICATION_REMINDER: {
    //         break;
    //     }
    //     case EVENT_TYPE.REMINDER: {
    //         break;
    //     }
    //     case EVENT_TYPE.ADVERSE_EVENT: {
    //         break;
    //     }
    //     case VERIFICATION_TYPE.PATIENT_SIGN_UP: {
    //         const { link } = payload;
    //         data = {
    //             $desktop_url: `${temp_app_link}/verify/${link}`,
    //             data: { url: NOTIFICATION_URLS.SIGN_UP, link }
    //         };
    //         break;
    //     }
    //     case EVENT_TYPE.FORGOT_PASSWORD: {
    //         const { link } = payload;
    //         data = {
    //             $desktop_url: `${temp_app_link}/reset-password/${link}`,
    //             data: {
    //                 url: NOTIFICATION_URLS.FORGOT_PASSWORD,
    //                 link
    //             }
    //         };
    //         break;
    //     }
    //     case EVENT_TYPE.ARTICLE: {
    //         break;
    //     }
    //     default:
    //         break;
    // }
    universalLink = await createLink(data);
    console.log("==============link", universalLink);
  } catch (err) {
    console.log("formatting universal link broke: ", err);
  }
  return universalLink;
};
