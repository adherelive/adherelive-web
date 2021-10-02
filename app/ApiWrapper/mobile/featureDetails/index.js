import BaseFeatureDetails from "../../../services/featureDetails";
import featureDetailsService from "../../../services/featureDetails/featureDetails.service";
import {FEATURE_TYPE} from "../../../../constant";

class FeatureDetailsWrapper extends BaseFeatureDetails {
    constructor(data) {
        super(data);
    }

    getAppointmentType = () => {
        const {getFeatureType, getFeatureDetails} = this;
        if (getFeatureType() === FEATURE_TYPE.APPOINTMENT) {
            const {appointment_type} = getFeatureDetails();

            return {
                ...appointment_type
            };
        }
    };

    getAppointmentTypeDescription = (id) => {
        const {getFeatureType, getFeatureDetails} = this;
        if (getFeatureType() === FEATURE_TYPE.APPOINTMENT) {
            const {type_description = []} = getFeatureDetails();

            return {
                appointment_type_descriptions: type_description[id]
            };
        }
    };
}

export default async (data = null, id = null) => {
    if (data) {
        return new FeatureDetailsWrapper(data);
    }
    const featureDetails = await featureDetailsService.getDetailsByData({id});
    return new FeatureDetailsWrapper(featureDetails);
};