import MedicationJob from "../";
import moment from "moment";
import { EVENT_TYPE, NOTIFICATION_VERB } from "../../../../constant";
import UserDeviceService from "../../../services/userDevices/userDevice.service";
import UserDeviceWrapper from "../../../ApiWrapper/mobile/userDevice";

const { MEDICATION_REMINDER_START } = NOTIFICATION_VERB;

class StartJob extends MedicationJob {
  constructor(data) {
    super(data);
  }

  getPushAppTemplate = async () => {
    const { getMedicationData } = this;
    const {
      details: {
        participants = [],
        actor: {
          id: actorId,
          details: { name, category: actorCategory } = {}
        } = {},
        medicines: { basic_info: { name: medicineName } = {} } = {},
        medications: {
          details: { unit, critical, quantity, strength } = {}
        } = {}
      },
      id
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

    // todo: add actor after testing (deployment)
    const medicationResponseUrl = `${process.config.WEB_URL}/m-api/events/${id}/complete`;

    templateData.push({
      app_id: process.config.one_signal.app_id, // TODO: add the same in pushNotification handler in notificationSdk
      headings: { en: `Medication Reminder` },
      contents: {
        en: `${critical ? "!IMPORTANT!" : ""} Time to take ${
          medicineName.length > 10
            ? medicineName.substring(0, 11)
            : medicineName
        }(${strength}${unit}${quantity ? `x${quantity}` : ""})`
      },
      buttons: [
        { id: "yes", text: "YES"},
        { id: "no", text: "NO" }
      ],
      include_player_ids: [...playerIds],
      priority: 10,
      android_channel_id: process.config.one_signal.urgent_channel_id,
      data: { url: "/medication-reminder", params: getMedicationData() }
    });

    return templateData;
  };

  getInAppTemplate = () => {
    const { getMedicationData } = this;
    const {
      details: {
        participants = [],
        actor: {
          id: actorId,
          details: { name, category: actorCategory } = {}
        } = {}
      },
      id,
      start_time
    } = getMedicationData() || {};

    console.log(
      "inside get in app template function: ",
      getMedicationData(),
      participants
    );

    const templateData = [];
    const now = moment();
    const currentTimeStamp = now.unix();
    for (const participant of participants) {
      templateData.push({
        actor: actorId,
        object: `${participant}`,
        foreign_id: `${id}`,
        verb: `${MEDICATION_REMINDER_START}:${currentTimeStamp}`,
        event: EVENT_TYPE.MEDICATION_REMINDER,
        time: start_time,
        start_time: start_time
      });
    }
    console.log("Returning templateData: ", templateData);
    return templateData;
  };
}

export default StartJob;
