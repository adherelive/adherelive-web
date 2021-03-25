import AgoraJob from "../index";
import UserDeviceService from "../../../services/userDevices/userDevice.service";
import UserDeviceWrapper from "../../../ApiWrapper/mobile/userDevice";
import {AGORA_CALL_NOTIFICATION_TYPES, USER_CATEGORY} from "../../../../constant";

class StartJob extends AgoraJob {
    constructor(data) {
        super(data);
    }

    getInAppTemplate = () => {};

    getPushAppTemplate = async () => {
        const {getAgoraData, getNotificationUrl} = this;

        const {
            roomId,
            actor: {
                id: actorId,
                details: {name:full_name, category}
            }
        } = getAgoraData() || {};

        const participants = roomId.split(`-${process.config.twilio.CHANNEL_SERVER}-`);

        const templateData = [];
        const playerIds = [];
        const userIds = [];

        participants.forEach(participant => {
            if (participant !== `${actorId}`) {
                userIds.push(participant);
            }
        });

        const userDevices = await UserDeviceService.getAllDeviceByData({
            user_id: userIds
        }) || [];

        if (userDevices.length > 0) {
            for (const device of userDevices) {
                const userDevice = await UserDeviceWrapper({ data: device });
                playerIds.push(userDevice.getOneSignalDeviceId());
            }
        }

        const url = getNotificationUrl(AGORA_CALL_NOTIFICATION_TYPES.START_CALL)

        templateData.push({
            small_icon: process.config.app.icon_android,
            app_id: process.config.one_signal.app_id,
            // content_available: true,
            include_player_ids: [...playerIds],
            headings: { en: `Call on Adhere` },
            contents: {
                en: `${category === USER_CATEGORY.DOCTOR ? "Dr. " : ""}${full_name} is calling you!`
            },
            priority: 10,
            android_channel_id: process.config.one_signal.urgent_channel_id,
            data: { url, params: getAgoraData() }
        });

        return templateData;
    };

}

export default StartJob;