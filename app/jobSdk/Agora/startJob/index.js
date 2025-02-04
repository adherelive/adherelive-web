import AgoraJob from "../index";

import UserRoleService from "../../../services/userRoles/userRoles.service";
import ProviderService from "../../../services/provider/provider.service";
import UserDeviceService from "../../../services/userDevices/userDevice.service";
import UserDeviceWrapper from "../../../apiWrapper/mobile/userDevice";
import {
  AGORA_CALL_NOTIFICATION_TYPES,
  DEFAULT_PROVIDER,
  USER_CATEGORY,
} from "../../../../constant";

import { createLogger } from "../../../../libs/log"
import moment from "moment";

const logger = createLogger("WEB > JOBS SDK > AGORA");

class StartJob extends AgoraJob {
  constructor(data) {
    super(data);
  }

  /**
   * Push the application templates
   *
   * @returns {Promise<*[]>}
   */
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
    logger.debug("Inside getPush App Template: \n");
    logger.debug(JSON.stringify(getAgoraData()));
    logger.debug("getPushTemplate ---> participants: ", participants);
    logger.debug("getPushTemplate ---> roomId: ", roomId);

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
    logger.debug("Start job for Agora using index.html: ");

    logger.debug("Push App Template -> userRoles: ", userRoles);
    for (const userRole of userRoles) {
      const { id, user_identity, linked_id } = userRole || {};
      logger.debug("User Role -> getPushTemplate: ", { userRole });
      logger.debug("ID, User Role ID, Linked ID, User ID ---> getPushTemplate: ", { id, user_role_id, linked_id, user_identity });
      if (id === user_role_id) {
        logger.debug("getPushTemplate -> in if - 1: ", id);
        // userIds.push(user_identity)
        if (linked_id) {
          providerId = linked_id;
          logger.debug("getPushTemplate -> in if - 2: ", providerId);
        }
      } else {
        logger.debug("getPushTemplate -> in else: ", user_identity);
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

    logger.debug("getPushTemplate -> userIds: ", { userIds });

    const userDevices =
      (await UserDeviceService.getAllDeviceByData({
        user_id: userIds,
      })) || [];
    logger.debug("getPushTemplate -> userDevices: ", { userDevices });
    if (userDevices.length > 0) {
      for (const device of userDevices) {
        const userDevice = await UserDeviceWrapper({ data: device });
        logger.debug("getPushTemplate -> userDevice: ", { userDevice });
        playerIds.push(userDevice.getOneSignalDeviceId());
      }
    }

    const url = getNotificationUrl(AGORA_CALL_NOTIFICATION_TYPES.START_CALL);

    logger.debug("Player ID's in Template: ", { playerIds });

    templateData.push({
      small_icon: process.config.app.icon_android,
      app_id: process.config.one_signal.app_id,
      // content_available: true,
      include_player_ids: [...playerIds],
      headings: { en: `Call on AdhereLive: (${providerName})` },
      contents: {
        en: `${
          category === USER_CATEGORY.DOCTOR || category === USER_CATEGORY.HSP
            ? "Dr. "
            : ""
        }${full_name} is calling you!`,
      },
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
          foreign_id: `${roomId}`,
          verb: `start_call:${currentTimeStamp}`,
          event: event_type,
          time: `${currentTime}`,
          create_time: `${currentTime}`,
        });
      }
    }
    return templateData;
  };
}

export default StartJob;
