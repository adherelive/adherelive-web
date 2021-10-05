import MedicationJob from "../";
import moment from "moment";
import {DEFAULT_PROVIDER, EVENT_TYPE, NOTIFICATION_VERB} from "../../../../constant";

import ProviderService from "../../../services/provider/provider.service";
import UserRoleService from "../../../services/userRoles/userRoles.service";
import UserDeviceService from "../../../services/userDevices/userDevice.service";
import UserDeviceWrapper from "../../../ApiWrapper/mobile/userDevice";

const {MEDICATION_REMINDER_START} = NOTIFICATION_VERB;

class StartJob extends MedicationJob {
    constructor(data) {
        super(data);
    }

    getPushAppTemplate = async () => {
        const {getMedicationData} = this;
        const {
            details: {
                participants = [],
                actor: {
                    id: actorId,
                    user_role_id,
                    details: {name, category: actorCategory} = {}
                } = {},
                medicines: {basic_info: {name: medicineName} = {}} = {},
                medications: {
                    details: {unit, critical, quantity, strength} = {}
                } = {}
            },
            id
        } = getMedicationData() || {};

        const templateData = [];
        const playerIds = [];
        const userIds = [];

        const {rows: userRoles = []} = await UserRoleService.findAndCountAll({
            where: {
                id: participants
            }
        }) || {};

        let providerId = null;
        for (const userRole of userRoles) {
            const {id, user_identity, linked_id} = userRole || {};

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
            const provider = await ProviderService.getProviderByData({id: providerId});
            const {name} = provider || {};
            providerName = name;
        }
        const userDevices = await UserDeviceService.getAllDeviceByData({
            user_id: userIds
        });

        if (userDevices.length > 0) {
            for (const device of userDevices) {
                const userDevice = await UserDeviceWrapper({data: device});
                playerIds.push(userDevice.getOneSignalDeviceId());
            }
        }

        // todo: add actor after testing (deployment)
        const medicationResponseUrl = `${process.config.WEB_URL}/m-api/events/${id}/complete`;

        templateData.push({
            small_icon: process.config.app.icon_android,
            app_id: process.config.one_signal.app_id, // TODO: add the same in pushNotification handler in notificationSdk
            headings: {en: `Medication Reminder (${providerName})`},
            contents: {
                en: `${critical ? "!IMPORTANT!" : ""} Time to take ${
                    medicineName.length > 10
                        ? medicineName.substring(0, 11)
                        : medicineName
                }(${strength}${unit}${quantity ? `x${quantity}` : ""})`
            },
            buttons: [
                {id: "yes", text: "YES"},
                {id: "no", text: "NO"}
            ],
            include_player_ids: [...playerIds],
            priority: 10,
            android_channel_id: process.config.one_signal.urgent_channel_id,
            data: {url: "/medication-reminder", params: getMedicationData()}
        });

        return templateData;
    };

    getInAppTemplate = () => {
        const {getMedicationData} = this;
        const {
            details: {
                participants = [],
                actor: {
                    id: actorId,
                    user_role_id,
                    details: {name, category: actorCategory} = {}
                } = {}
            },
            id,
            start_time
        } = getMedicationData() || {};

        const templateData = [];
        const now = moment();
        const currentTimeStamp = now.unix();
        for (const participant of participants) {
            if (participant !== user_role_id) {
                templateData.push({
                    actor: actorId,
                    actorRoleId: user_role_id,
                    object: `${participant}`,
                    foreign_id: `${id}`,
                    verb: `${MEDICATION_REMINDER_START}:${currentTimeStamp}`,
                    event: EVENT_TYPE.MEDICATION_REMINDER,
                    time: start_time,
                    start_time: start_time
                });
            }
        }
        return templateData;
    };
}

export default StartJob;
