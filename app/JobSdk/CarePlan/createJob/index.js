import CarePlanJob from "../";
import moment from "moment";
import { EVENT_TYPE } from "../../../../constant";

import UserDeviceService from "../../../services/userDevices/userDevice.service";

import UserDeviceWrapper from "../../../ApiWrapper/mobile/userDevice";

class CreateJob extends CarePlanJob {
  constructor(data) {
    super(data);
  }

  getPushAppTemplate = async () => {
    const { _data } = this;
    console.log("data got in get push app template is: ", _data);
    const {
      details: {
        participants = [],
        actor: {
          id: actorId,
          user_role_id,
          details: { name, category: actorCategory } = {}
        } = {}
      },
      event_id = null,
      id = null
    } = _data || {};

    // console.log("details are: ", _data.getDetails());

    const templateData = [];
    const playerIds = [];
    const userIds = [];

    // const vitals = await VitalWrapper({ id: _data.getEventId() });
    // const { vitals: latestVital } = await vitals.getAllInfo();

    console.log("1289317932  participants, actorId", participants, actorId);

    participants.forEach(participant => {
      if (participant !== actorId) {
        userIds.push(participant);
      }
    });

    console.log("user ids formed are: ", userIds);

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
      headings: { en: `New careplan created!` },
      contents: {
        en: `Did you buy the required medicines for the new careplan?`
      },
      buttons: [
        { id: "yes", text: "Yes" },
        { id: "no", text: "No" }
      ],
      include_player_ids: [...playerIds],
      priority: 10,
      data: {
        url: "/careplan-activation",
        type: "normal",
        params: { care_plan_id: event_id, schedule_event_id: id }
      }
    });

    console.log("Returning template data is: ", templateData);

    return templateData;
  };

  getInAppTemplate = () => {
    const { _data } = this;
    const {
      details: {
        participants = [],
        actor: {
          id: actorId,
          user_role_id,
          details: { name, category: actorCategory } = {}
        } = {}
      },
      id = null
    } = _data || {};

    const templateData = [];
    const currentTime = new moment().utc().toISOString();
    const now = moment();
    const currentTimeStamp = now.unix();
    for (const participant of participants) {
      if (participant !== actorId) {
        templateData.push({
          actor: actorId,
          actorRoleId: user_role_id,
          object: `${participant}`,
          foreign_id: `${id}`,
          verb: `careplan_create:${currentTimeStamp}`,
          event: EVENT_TYPE.CARE_PLAN_ACTIVATION,
          time: currentTime,
          create_time: `${currentTime}`
        });
      }
    }

    console.log(
      "Returning template data in get in app template of careplan: ",
      templateData
    );

    return templateData;
  };
}

export default CreateJob;
