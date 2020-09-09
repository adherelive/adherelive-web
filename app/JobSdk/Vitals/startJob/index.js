import VitalJob from "../";
import moment from "moment";
import { EVENT_TYPE, USER_CATEGORY } from "../../../../constant";

import UserDeviceService from "../../../services/userDevices/userDevice.service";

import UserDeviceWrapper from "../../../ApiWrapper/mobile/userDevice";

class CreateJob extends VitalJob {
    constructor(data) {
        super(data);
    }

    getPushAppTemplate = async () => {
        const { getData } = this;
        const {
            participants = [],
            actor: {
                id: actorId,
                details: { name, category: actorCategory } = {}
            } = {},
            vital_templates: { basic_info: { name: vitalName = "" } = {} } = {},
            eventId = null
        } = getData() || {};

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
            app_id: process.config.one_signal.app_id, // TODO: add the same in pushNotification handler in notificationSdk
            headings: { en: `${vitalName} Reminder` },
            contents: {
                en: `Please update ${vitalName} vital`
            },
            // buttons: [{ id: "yes", text: "Yes" }, { id: "no", text: "No" }],
            include_player_ids: [...playerIds],
            priority: 10,
            data: { url: "/vitals", params: getData(), eventId }
        });

        return templateData;
    };

    getInAppTemplate = () => {
        const { getData } = this;
        const {
            participants = [],
            actor: {
                id: actorId,
            } = {},
            eventId = null
        } = getData() || {};

        const templateData = [];
        const currentTime = new moment().utc();
        for (const participant of participants) {
            if (participant !== actorId) {
                templateData.push({
                    actor: actorId,
                    object: `${participant}`,
                    foreign_id: `${eventId}`,
                    verb: "vital_create",
                    event: EVENT_TYPE.VITALS,
                    time: currentTime
                });
            }
        }

        return templateData;
    };
}

export default CreateJob;
