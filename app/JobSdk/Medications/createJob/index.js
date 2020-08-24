import MedicationJob from "../";
import moment from "moment";

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
                foreign_id: `medication:${medicationId}`,
                verb: "medication_create",
                message: `${name}(${actorCategory}) has created a medication reminder`,
                time: currentTime
            });
            // }
        }

        return templateData;
    };
}

export default CreateJob;