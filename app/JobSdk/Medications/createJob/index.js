import MedicationJob from "../";
import moment from "moment";
import { EVENT_TYPE } from "../../../../constant";

class CreateJob extends MedicationJob {
  constructor(data) {
    super(data);
  }

  getPushAppTemplate = () => {
    const { getMedicationData } = this;
    const {
      participants = [],
      actor: {
        id: actorId,
        details: { name, category: actorCategory } = {}
      } = {},
      medicationId = null
    } = getMedicationData() || {};

    const templateData = [];

    for (const participant of participants) {
      if (participant !== actorId) {
        // todo: add actor after testing (deployment)

        templateData.push({
          app_id: process.config.one_signal.app_id, // TODO: add the same in pushNotification handler in notificationSdk
          headings: { en: `Appointment Created` },
          contents: {
            en: `${name}(${actorCategory}) has created a medication reminder with you`
          },
          // buttons: [{ id: "yes", text: "Yes" }, { id: "no", text: "No" }],
          include_player_ids: [...participants],
          priority: 10,
          android_channel_id: process.config.one_signal.urgent_channel_id,
          data: { url: "/medications", params: getMedicationData() }
        });
      }
    }

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
      medicationId
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
        foreign_id: `${medicationId}`,
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
