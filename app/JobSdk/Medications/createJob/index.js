import MedicationJob from "../";
import moment from "moment";
import {EVENT_TYPE} from "../../../../constant";

class CreateJob extends MedicationJob {
    constructor(data) {
        super(data);
    }

    getInAppTemplate = () => {
        const { getMedicationData } = this;
        const {
            participants = [],
            actor: {
                id: actorId,
                details: { name, category: actorCategory } = {}
            } = {},
            medicationId
        } = getMedicationData() || {};

        const templateData = [];
        const currentTime = new moment().utc();
        for (const participant of participants) {
            // if (participant !== actorId) {
            templateData.push({
                actor: actorId,
                object: `${participant}`,
                foreign_id: `${medicationId}`,
                verb: "medication_create",
                event: EVENT_TYPE.MEDICATION_REMINDER,
                // message: `${name}(${actorCategory}) has created a medication reminder`,
                time: currentTime
            });
            // }
        }

        return templateData;
    };
}

export default CreateJob;