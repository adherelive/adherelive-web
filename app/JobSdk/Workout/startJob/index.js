import WorkoutJob from "../";
import moment from "moment";
import { EVENT_TYPE, NOTIFICATION_VERB } from "../../../../constant";
import UserDeviceService from "../../../services/userDevices/userDevice.service";
import UserDeviceWrapper from "../../../ApiWrapper/mobile/userDevice";

class StartJob extends WorkoutJob {
  constructor(data) {
    super(data);
  }

  getPushAppTemplate = async () => {
    const { getWorkoutData } = this;
    const {
      details: {
        workouts = {},
        workout_id = null,
        participants = [],
        actor: {
          id: actorId,
          details: { name, category: actorCategory } = {}
        } = {}
      },
      id
    } = getWorkoutData() || {};

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

    let workoutName = "";
    if(workout_id) {
      const {basic_info: {name} = {}} = workouts[workout_id] || {};
      workoutName = name;
    }

    templateData.push({
      small_icon: process.config.app.icon_android,
      app_id: process.config.one_signal.app_id,
      headings: { en: `Workout Reminder` },
      contents: {
        en: `Time to do ${workoutName}. Tap here to know more!`
      },
      // buttons: [
      //   { id: "yes", text: "YES"},
      //   { id: "no", text: "NO" }
      // ],
      include_player_ids: [...playerIds],
      priority: 10,
      android_channel_id: process.config.one_signal.urgent_channel_id,
      data: { url: `/${NOTIFICATION_VERB.WORKOUT_START}`, params: getWorkoutData() }
    });

    return templateData;
  };

  getInAppTemplate = () => {
    const { getWorkoutData } = this;
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
    } = getWorkoutData() || {};

    const templateData = [];
    const now = moment();
    const currentTimeStamp = now.unix();
    for (const participant of participants) {
      if (participant !== actorId) {
        templateData.push({
            actor: actorId,
            object: `${participant}`,
            foreign_id: `${id}`,
            verb: `${NOTIFICATION_VERB.WORKOUT_START}:${currentTimeStamp}`,
            event: EVENT_TYPE.WORKOUT,
            time: start_time,
            start_time: start_time
        });
     }
    }
    return templateData;
  };
}

export default StartJob;
