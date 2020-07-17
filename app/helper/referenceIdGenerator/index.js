import {USER_REFERENCE_ID_SIZE} from "../../../constant";
import moment from "moment";

const PROVIDER_ADHERE = "Adhere";

export const formatReferenceId = (id) => {
    return `${PROVIDER_ADHERE.substring(0,3).toLocaleUpperCase()}/${moment().year()}/${id}`;
};

export default (id, providerId = null) => {
    if(providerId) {
        // update ID creation for each user on a provider basis
    }
    if (`${id}`.length < USER_REFERENCE_ID_SIZE) {
        let formattedId = `${id}`;
        const diff = (USER_REFERENCE_ID_SIZE - `${id}`.length);
        for(let i = 0; i < diff; i++) {
            formattedId = `0${formattedId}`;
        }
        return formatReferenceId(formattedId);
    } else {
        return formatReferenceId(id);
    }
};