import MedicationJob from "../";
import moment from "moment";
import UserDeviceService from "../../../services/userDevices/userDevice.service";
import UserDeviceWrapper from "../../../ApiWrapper/mobile/userDevice";
import { EVENT_TYPE } from "../../../../constant";

class CreateJob extends MedicationJob {
  constructor(data) {
    super(data);
  }

  getPushAppTemplate = async () => {
    const { getMedicationData } = this;
    const {
      participants = [],
      actor: {
        id: actorId,
        details: { name, category: actorCategory } = {}
      } = {},
      event_id = null
    } = getMedicationData() || {};

    const templateData = [];
    const playerIds = [];
    const userIds = [];

    participants.forEach(participant => {
      if (participant !== actorId) {
        userIds.push(participant);
      }
    });

    const userDevices = await UserDeviceService.getAllDeviceByData({
      user_id: userIds
    });

    if (userDevices.length > 0) {
      for (const device of userDevices) {
        const userDevice = await UserDeviceWrapper({ data: device });
        playerIds.push(userDevice.getOneSignalDeviceId());
      }
    }

    templateData.push({
      small_icon: process.config.app.icon_android,
      app_id: process.config.one_signal.app_id, // TODO: add the same in pushNotification handler in notificationSdk
      headings: { en: `Medication Created` },
      contents: {
        en: `${name}(${actorCategory}) has created a medication reminder with you. Tap here to know more!`
      },
      // buttons: [{ id: "yes", text: "Yes" }, { id: "no", text: "No" }],
      include_player_ids: [...playerIds],
      priority: 10,
      android_channel_id: process.config.one_signal.urgent_channel_id,
      data: { url: "/medications", params: getMedicationData() }
    });

    return templateData;
  };

  getInAppTemplate = () => {
    const { getMedicationData } = this;
    const {
      participants = [],
      actor: {
        id: actorId,
        details: { name, category: actorCategory } = {}
      } = {},
      event_id
    } = getMedicationData() || {};

    const templateData = [];
    const currentTime = new moment().utc().toISOString();
    const now = moment();
    const currentTimeStamp = now.unix();
    for (const participant of participants) {
      // if (participant !== actorId) {
      templateData.push({
        actor: actorId,
        object: `${participant}`,
        foreign_id: `${event_id}`,
        verb: `medication_create:${currentTimeStamp}`,
        event: EVENT_TYPE.MEDICATION_REMINDER,
        // message: `${name}(${actorCategory}) has created a medication reminder`,
        time: currentTime,
        create_time: `${currentTime}`
      });
      // }
    }

    return templateData;
  };
}

export default CreateJob;
