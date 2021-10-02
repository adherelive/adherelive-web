import BaseSimilarFoodMapping from "../../../services/similarFoodMapping";
import SimilarFoodMappingService from "../../../services/similarFoodMapping/similarFoodMapping.service";

class SimilarFoodMappingWrapper extends BaseSimilarFoodMapping {
    constructor(data) {
        super(data);
    }

    getBasicInfo = () => {
        const {_data} = this;
        const {
            id,
            related_to_id,
            secondary_id
        } = _data || {};
        return {
            basic_info: {
                id,
                related_to_id,
                secondary_id
            },
        };
    };
}

export default async ({data = null, id = null}) => {
    if (data !== null) {
        return new SimilarFoodMappingWrapper(data);
    }

    const similarFoodMappingService = new SimilarFoodMappingService();
    const mapping = await similarFoodMappingService.getByData({id});
    return new SimilarFoodMappingWrapper(mapping);
};
