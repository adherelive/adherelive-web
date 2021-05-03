import ChatJob from "../";
import moment from "moment";
import { MESSAGE_TYPES } from "../../../../constant";

import UserDeviceService from "../../../services/userDevices/userDevice.service";
import UserDeviceWrapper from "../../../ApiWrapper/mobile/userDevice";
import {getRoomId} from "../../../helper/common";
import { USER_CATEGORY } from "../../../../constant";

class UserMessageJob extends ChatJob {
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
            participant_role_ids = [],
            details: {
                message = ""
            }
        } = getData() || {};

        let doctorRoleId = actorCategory === USER_CATEGORY.DOCTOR? actorRoleId: null;
        let patientRoleId = actorCategory === USER_CATEGORY.PATIENT? actorRoleId: null;

        const templateData = [];
        const playerIds = [];
        const userIds = [];

        // non actor participants are added for notification
        participant_role_ids.forEach(participant => {
            if (participant !== actorId) {
                if(!doctorRoleId) {
                    doctorRoleId = participant
                } else if(!patientRoleId) {
                    patientRoleId = participant
                }
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

        const roomId = getRoomId(doctorRoleId, patientRoleId)
        const now = new Date()

        templateData.push({
            small_icon: process.config.app.icon_android,
            app_id: process.config.one_signal.app_id,
            headings: { en: "New Message" },
            contents: {
                en: `${name}: ${message}`
            },
            include_player_ids: [...playerIds],
            priority: 10,
            android_group:`adhere.live`,
            // android_group_message: {en: "You have $[notif_count] new messages"},
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
            participants = [],
            // doctor_id,
            // patient_id,
            details: {
                // message = ""
            }
        } = getData() || {};

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

export default UserMessageJob;