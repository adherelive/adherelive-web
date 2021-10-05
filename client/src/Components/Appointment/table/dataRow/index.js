import {formatAppointmentTableData, TABLE_COLUMN} from "../helper";

export default data => {
    const {id} = data;
    const formattedData = formatAppointmentTableData(data);
    const {appointmentData, userData, treatmentData, doctorData, providerData, chatData} =
    formattedData || {};
    return {
        key: id,
        [TABLE_COLUMN.ORGANIZER.dataIndex]: {
            appointmentData,
            userData
        },
        [TABLE_COLUMN.DATE.dataIndex]: {
            appointmentData
        },
        [TABLE_COLUMN.TIMING.dataIndex]: {
            appointmentData
        },
        [TABLE_COLUMN.DESCRIPTION.dataIndex]: {
            appointmentData
        },
    };
};
