import AgoraJob from "../index";

import UserRoleService from "../../../services/userRoles/userRoles.service";
import ProviderService from "../../../services/provider/provider.service";
import UserDeviceService from "../../../services/userDevices/userDevice.service";
import UserDeviceWrapper from "../../../apiWrapper/mobile/userDevice";
import { AGORA_CALL_NOTIFICATION_TYPES, DEFAULT_PROVIDER, USER_CATEGORY, } from "../../../../constant";

import moment from "moment";

class MissedJob extends AgoraJob {
  constructor(data) {
    super(data);
  }

  getPushAppTemplate = async () => {
    const { getAgoraData, getNotificationUrl } = this;

    const {
      roomId,
      actor: {
        id: actorId,
        user_role_id,
        details: { name: full_name, category },
      },
    } = getAgoraData() || {};

    const participants = roomId.split(
      `-${process.config.twilio.CHANNEL_SERVER}-`
    );

    const templateData = [];
    const playerIds = [];
    const userIds = [];

    const { rows: userRoles = [] } =
      (await UserRoleService.findAndCountAll({
        where: {
          id: participants,
        },
      })) || {};

    let providerId = null;
    for (const userRole of userRoles) {
      const { id, user_identity, linked_id } = userRole || {};
      if (id === user_role_id) {
        if (linked_id) {
          providerId = linked_id;
        }
      } else {
        userIds.push(user_identity);
      }
    }

    let providerName = DEFAULT_PROVIDER;
    if (providerId) {
      const provider = await ProviderService.getProviderByData({
        id: providerId,
      });
      const { name } = provider || {};
      providerName = name;
    }

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

    const url = getNotificationUrl(AGORA_CALL_NOTIFICATION_TYPES.MISSED_CALL);

    templateData.push({
      small_icon: process.config.app.icon_android,
      app_id: process.config.one_signal.app_id,
      headings: { en: `Missed call (${providerName})` },
      contents: {
        en: `You missed a call from ${
          category === USER_CATEGORY.DOCTOR || category === USER_CATEGORY.HSP
            ? "Dr. "
            : ""
        }${full_name}.`,
      },
      include_player_ids: [...playerIds],
      priority: 10,
      android_channel_id: process.config.one_signal.urgent_channel_id,
      data: { url, params: getAgoraData() },
    });

    return templateData;
  };

  getInAppTemplate = () => {
    const { getAgoraData } = this;
    const {
      actor: {
        id: actorId,
        user_role_id,
        details: { name, category: actorCategory } = {},
      } = {},
      event_id,
      event_type,
      roomId,
    } = getAgoraData() || {};

    const participants = roomId.split(
      `-${process.config.twilio.CHANNEL_SERVER}-`
    );

    const templateData = [];

    const currentTime = new moment().utc().toISOString();
    const now = moment();
    const currentTimeStamp = now.unix();

    for (const participant of participants) {
      if (participant !== `${user_role_id}`) {
        templateData.push({
          actor: actorId,
          actorRoleId: user_role_id,
          object: `${participant}`,
          foreign_id: `${event_id}`,
          verb: `missed_call:${currentTimeStamp}`,
          event: event_type,
          time: `${currentTime}`,
          create_time: `${currentTime}`,
        });
      }
    }
    return templateData;
  };
}

export default MissedJob;
