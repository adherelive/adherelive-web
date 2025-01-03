import AuthJob from "../";
import moment from "moment";

import UserDeviceService from "../../../services/userDevices/userDevice.service";
import UserDeviceWrapper from "../../../apiWrapper/mobile/userDevice";
import { NOTIFICATION_VERB } from "../../../../constant";

export default class DeactivateDoctorJob extends AuthJob {
  constructor(data) {
    super(data);
  }

  getEmailTemplate = () => {};

  getSmsTemplate = () => {};

  getPushAppTemplate = async () => {
    const { getData } = this;
    const {
      actor: { id: actorId, details: { name } = {} } = {},
      participants = [],
    } = getData() || {};

    const templateData = [];
    const playerIds = [];
    const userIds = [];

    // non actor participants are added for notification
    participants.forEach((participant) => {
      if (participant !== actorId) {
        userIds.push(participant);
      }
    });

    const userDevices =
      (await UserDeviceService.getAllDeviceByData({
        user_id: userIds,
      })) || [];

    if (userDevices.length > 0) {
      for (const device of userDevices) {
        const userDevice = await UserDeviceWrapper({ data: device });
        playerIds.push(userDevice.getOneSignalDeviceId());
      }
    }

    templateData.push({
      small_icon: process.config.app.icon_android,
      app_id: process.config.one_signal.app_id,
      headings: { en: "Doctor Association" },
      contents: {
        en: `Dr. ${name} is not associated with the platform anymore. Platform owns no obligation if you continue the medication prescribed by this doctor.`,
      },
      include_player_ids: [...playerIds],
      priority: 10,
      android_channel_id: process.config.one_signal.urgent_channel_id,
      data: { url: `/`, params: { ...getData() } },
    });
    // }

    return templateData;
  };

  getInAppTemplate = () => {
    const { getData } = this;
    const {
      actor: { id: actorId, details: { name } = {} } = {},
      participants = [],
      // doctor_id,
      // patient_id,
    } = getData() || {};

    const templateData = [];
    const currentTime = new moment().utc().toISOString();
    const now = moment();
    const currentTimeStamp = now.unix();
    for (const participant of participants) {
      if (participant !== actorId) {
        templateData.push({
          actor: actorId,
          object: `${participant}`,
          foreign_id: ``,
          verb: `${NOTIFICATION_VERB.DEACTIVATE_DOCTOR}:${currentTimeStamp}`,
          event: NOTIFICATION_VERB.DEACTIVATE_DOCTOR,
          time: `${currentTime}`,
          create_time: `${currentTime}`,
        });
      }
    }
    return templateData;
  };
}
