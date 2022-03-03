import { TABLE_COLUMN } from "../helper";

export default (data) => {
  const { basic_info: { id = null } = {}, formatMessage } = data;
  // console.log("data in datarow",data);

  return {
    key: id,
    [TABLE_COLUMN.NAME.dataIndex]: {
      data,
    },
    [TABLE_COLUMN.STATUS.dataIndex]: {
      data,
    },
    [TABLE_COLUMN.DURATION.dataIndex]: {
      data,
    },
    [TABLE_COLUMN.FEES.dataIndex]: {
      data,
    },
    [TABLE_COLUMN.TASKS.dataIndex]: {
      data,
      formatMessage,
    },
    [TABLE_COLUMN.EDIT.dataIndex]: {
      data,
      formatMessage,
    },
  };
};
