import {isEmpty} from "lodash";

export const getVitalUpdateData = ({
                                       start_date,
                                       end_date,
                                       repeat_interval_id,
                                       repeat_days,
                                       description,
                                       previousVital
                                   }) => {
    let prevDetails = {...previousVital.getDetails()};
    let dataToUpdate = {};

    if (!isEmpty(start_date)) {
        dataToUpdate["start_date"] = start_date;
    }

    if (!isEmpty(end_date)) {
        dataToUpdate["end_date"] = end_date;
    }

    if (!isEmpty(repeat_interval_id)) {
        dataToUpdate["details"] = {
            ...prevDetails,
            repeat_interval_id
        };
        prevDetails = {...prevDetails, repeat_interval_id};
    }

    if (!isEmpty(repeat_days)) {
        dataToUpdate["details"] = repeat_days;
        dataToUpdate["details"] = {
            ...prevDetails,
            repeat_days
        };
        prevDetails = {...prevDetails, repeat_days};
    }

    if (!isEmpty(description)) {
        dataToUpdate["description"] = description;
    }

    return dataToUpdate;
};
