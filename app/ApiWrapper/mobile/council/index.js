import BaseCouncil from "../../../services/council";
import councilService from "../../../services/council/council.service";

class CouncilWrapper extends BaseCouncil {
    constructor(data) {
        super(data);
    }

    getBasicInfo = () => {
        const { _data } = this;
        const {
            id,
            name
        } = _data || {};
        return {
            basic_info: {
                id,
                name,
            },
        };
    };
}

export default async (data = null, id = null) => {
    if (data !== null) {
        return new CouncilWrapper(data);
    }
    const council = await councilService.getByData({ id });
    return new CouncilWrapper(council);
};
