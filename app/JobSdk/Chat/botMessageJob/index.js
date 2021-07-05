import ChatJob from "../";
import moment from "moment";

import {MESSAGE_TYPES} from "../../../../constant"

import UserRoleService from "../../../services/userRoles/userRoles.service";
import ProviderService from "../../../services/provider/provider.service";
import UserDeviceService from "../../../services/userDevices/userDevice.service";
import UserDeviceWrapper from "../../../ApiWrapper/mobile/userDevice";
import {getRoomId} from "../../../helper/common";
import { USER_CATEGORY, DEFAULT_PROVIDER } from "../../../../constant";

class BotMessageJob extends ChatJob {
    constructor(data) {
        super(data);
    }

    getEmailTemplate = () => {};

    getSmsTemplate = () => {};

    getPushAppTemplate = async () => {
        const { getData } = this;
        const {
            actor: {
                id: actorId,
                user_role_id: actorRoleId,
                details: { name, category: actorCategory } = {}
            } = {},
            participants = [],
            details: {
                message = ""
            }
        } = getData() || {};

        let doctorRoleId = actorCategory === USER_CATEGORY.DOCTOR? actorRoleId: null;
        let patientRoleId = actorCategory === USER_CATEGORY.PATIENT? actorRoleId: null;

        const templateData = [];
        const playerIds = [];
        const userIds = [];

        const userRoleIds = [];

        participants.forEach(participant => {
        if (participant !== actorRoleId) {
            userRoleIds.push(participant);
            if(!doctorRoleId) {
                doctorRoleId = participant
            } else if(!patientRoleId) {
                patientRoleId = participant
            }
        }
        });

        const {rows: userRoles = []} = await UserRoleService.findAndCountAll({
        where: {
            id: userRoleIds
        }
        }) || {};

        let providerId = null;
        for(const userRole of userRoles) {
        const {id, user_identity, linked_id} = userRole || {};
        userIds.push(user_identity);

        if(id === actorRoleId) {
            if(linked_id) {
            providerId = linked_id;
            }
        }
        }

        let providerName = DEFAULT_PROVIDER;
        if(providerId) {
        const provider = await ProviderService.getProviderByData({id: providerId});
        const {name} = provider || {};
        providerName = name;
        }


        const userDevices = await UserDeviceService.getAllDeviceByData({
            user_id: userIds
        }) || [];

        if (userDevices.length > 0) {
            for (const device of userDevices) {
                const userDevice = await UserDeviceWrapper({ data: device });
                playerIds.push(userDevice.getOneSignalDeviceId());
            }
        }

        const roomId = getRoomId(doctorRoleId, patientRoleId)

        templateData.push({
            small_icon: process.config.app.icon_android,
            app_id: process.config.one_signal.app_id,
            headings: { en: `New Message (${providerName})` },
            contents: {
                en: `${name}: ${message}`
            },
            include_player_ids: [...playerIds],
            priority: 10,
            android_group:"adhere.live",
            android_channel_id: process.config.one_signal.urgent_channel_id,
            data: { url: `/chat-message`, params: {...getData(), doctorUserId: doctorRoleId, patientUserId: patientRoleId, roomId }}
        });
        // }

        return templateData;
    };

    getInAppTemplate = () => {
        const { getData } = this;
        const {
            actor: {
                id: actorId,
                user_role_id,
                details: { name, category: actorCategory } = {}
            } = {},
            participants = []
        } = getData() || {};

        const templateData = [];
        const currentTime = new moment().utc().toISOString();
        const now = moment();
        const currentTimeStamp = now.unix();
        for (const participant of participants) {
            if (participant !== user_role_id) {
                templateData.push({
                    actor: actorId,
                    actorRoleId: user_role_id,
                    object: `${participant}`,
                    foreign_id: ``,
                    verb: `user_message:${currentTimeStamp}`,
                    message: `by ${actorCategory} ${name}`,
                    event: MESSAGE_TYPES.USER_MESSAGE,
                    time: `${currentTime}`,
                    create_time: `${currentTime}`
                });
            }
        }
        return templateData;
    };
}

export default BotMessageJob;