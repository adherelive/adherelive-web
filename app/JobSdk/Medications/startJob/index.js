import MedicationJob from "../";
import moment from "moment";
import { EVENT_TYPE, NOTIFICATION_VERB } from "../../../../constant";

const { MEDICATION_REMINDER_START } = NOTIFICATION_VERB;

class StartJob extends MedicationJob {
  constructor(data) {
    super(data);
  }

  getPushAppTemplate = () => {
    const { getMedicationData } = this;
    const {
      details: {
        participants = [],
        actor: {
          id: actorId,
          details: { name, category: actorCategory } = {}
        } = {}
      }
    } = getMedicationData() || {};

    const templateData = [];

    for (const participant of participants) {
      if (participant !== actorId) {
        // todo: add actor after testing (deployment)

        templateData.push({
          app_id: process.config.one_signal.app_id, // TODO: add the same in pushNotification handler in notificationSdk
          headings: { en: `Medication Reminder` },
          contents: {
            en: `A medication reminder is scheduled for you.`
          },
          // buttons: [{ id: "yes", text: "Yes" }, { id: "no", text: "No" }],
          include_player_ids: [...participants],
          priority: 10,
          data: { url: "/medications", params: getMedicationData() }
        });
      }
    }

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
